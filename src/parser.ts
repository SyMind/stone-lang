import {ASTree, ASTList, ASTLeaf} from './ast'
import * as l from './lexer'
import {ParseError} from './errors'

type ASTreeSubCtor = new (...args: any) => ASTree
type ASTListSubCtor = new (...args: any) => ASTList
type ASTLeafSubCtor = new (...args: any) => ASTLeaf

export class Precedence {
    value: number
    leftAssoc: boolean

    constructor(v: number, a: boolean) {
        this.value = v
        this.leftAssoc = a
    }
}

export class Operators {
    static LEFT = true
    static RIGHT = false
    private map: Map<String, Precedence>
    constructor(entries?: readonly (readonly [String, Precedence])[]) {
        this.map = new Map(entries);
    }
    add(name: string, prec: number, leftAssoc: boolean): void {
        this.map.set(name, new Precedence(prec, leftAssoc))
    }
    get(name: string): Precedence {
        return this.map.get(name)
    }
}

abstract class Element {
    abstract parse(lexer: l.Lexer, res: ASTree[]): Promise<void>
    abstract match(lexer: l.Lexer): Promise<boolean>
}

export class Expr extends Element {
    factory: Factory
    factor: Parser
    ops: Operators
    constructor(ctor: ASTListSubCtor, exp: Parser, map: Operators) {
        super()
        this.factory = Factory.getForASTList(ctor)
        this.factor = exp
        this.ops = map
    }
    async parse(lexer: l.Lexer, res: ASTree[]): Promise<void> {
        let right = await this.factor.parse(lexer)
        let prec: Precedence
        while ((prec = await this.nextOperator(lexer)) != null) {
            right = await this.doShift(lexer, right, prec.value)
        }
        res.push(right)
    }
    async nextOperator(lexer: l.Lexer): Promise<Precedence> {
        const t = await lexer.peek(0)
        if (t.isIdentifier()) {
            return this.ops.get(t.getText())
        }
        return null
    }
    async doShift(lexer: l.Lexer, left: ASTree, prec: number) {
        const list: ASTree[] = []
        list.push(left)
        list.push(new ASTLeaf(await lexer.read()))
        let right = await this.factor.parse(lexer)
        let next: Precedence
        while ((next = await this.nextOperator(lexer)) != null && this.rightIsExpr(prec, next)) {
            right = await this.doShift(lexer, right, next.value)
        }

        list.push(right)
        return this.factory.make(list)
    }
    rightIsExpr(prec: number, nextPrec: Precedence) {
        return nextPrec.leftAssoc ? prec < nextPrec.value : prec <= nextPrec.value
    }
    async match(lexer: l.Lexer): Promise<boolean> {
        return await this.factor.match(lexer)
    }
}

class Tree extends Element {
    parser: Parser
    constructor(p: Parser) {
        super()
        this.parser = p
    }
    async parse(lexer: l.Lexer, res: ASTree[]): Promise<void> {
        res.push(await this.parser.parse(lexer))
    }
    async match(lexer: l.Lexer): Promise<boolean> {
        return await this.parser.match(lexer)
    }
}

class OrTree extends Element {
    parsers: Parser[]
    constructor(parsers: Parser[]) {
        super()
        this.parsers = parsers
    }
    async parse(lexer: l.Lexer, res: ASTree[]): Promise<void> {
        const p = await this.choose(lexer)
        if (p == null) {
            throw new ParseError(await lexer.peek(0).toString())
        }
        res.push(await p.parse(lexer))
    }
    async match(lexer: l.Lexer): Promise<boolean> {
        return this.choose(lexer) != null
    }
    async choose(lexer: l.Lexer): Promise<Parser> {
        for (const p of this.parsers) {
            if (await p.match(lexer)) {
                return p
            }
        }
        return null
    }
}

class Repeat extends Element {
    parser: Parser
    onlyOnce: boolean
    constructor(parser: Parser, onlyOnce: boolean) {
        super()
        this.parser = parser
        this.onlyOnce = onlyOnce
    }
    async parse(lexer: l.Lexer, res: ASTree[]): Promise<void> {
        while (this.match(lexer)) {
            const t = await this.parser.parse(lexer)
            if (!(t instanceof ASTList) || t.numChildren() > 0) {
                res.push(t)
            }
            if (this.onlyOnce) {
                break
            }
        }
    }
    async match(lexer: l.Lexer): Promise<boolean> {
        return await this.parser.match(lexer)
    }
}

class Leaf extends Element {
    tokens: string[]
    constructor(tokens: string[]) {
        super()
        this.tokens = tokens
    }
    async parse(lexer: l.Lexer, res: ASTree[]): Promise<void> {
        const t = await lexer.read()
        if (t.isIdentifier()) {
            for (const token of this.tokens) {
                if (token === t.getText()) {
                    this.find(res, t)
                    return
                }
            }
        }
        if (this.tokens.length > 0) {
            throw new ParseError(`${this.tokens[0]} expected.`)
        } else {
            throw new ParseError(t.toString())
        }
    }
    find(res: ASTree[], t: l.Token): void {
        res.push(new ASTLeaf(t))
    }
    async match(lexer: l.Lexer): Promise<boolean> {
        const t = await lexer.peek(0)
        if (t.isIdentifier()) {
            for (const token of this.tokens) {
                if (token === t.getText()) {
                    return true
                }
            }
        }
        return false
    }
}

export class Skip extends Leaf {
    find(res: ASTree[], t: l.Token): void {}
}

abstract class AToken extends Element {
    factory: Factory
    constructor(ctor: ASTLeafSubCtor) {
        super()
        if (ctor === null) {
            ctor = ASTLeaf
        }
        this.factory = Factory.get<l.Token>(ctor);
    }
    async parse(lexer: l.Lexer, res: ASTree[]): Promise<void> {
        const t = await lexer.read()
        if (this.test(t)) {
            const leaf = this.factory.make(t)
            res.push(leaf)
        } else {
            throw new ParseError(t.getText())
        }
    }
    async match(lexer: l.Lexer): Promise<boolean> {
        const t = await lexer.peek(0)
        return this.test(t)
    }
    abstract test(t: l.Token): boolean
}

export class IdToken extends AToken {
    reserved: Set<string>
    constructor(ctor: ASTLeafSubCtor, reserved: Set<string>) {
        super(ctor)
        this.reserved = reserved !== null ? reserved : new Set<string>()
    }
    test(t: l.Token): boolean {
        return t.isIdentifier() && !this.reserved.has(t.getText())
    }
}

export class NumToken extends AToken {
    test(t: l.Token): boolean {
        return t.isNumber()
    }
}

export class StrToken extends AToken {
    test(t: l.Token): boolean {
        return t.isString()
    }
}

export abstract class Factory {
    abstract make0(arg: any): ASTree
    make(arg: any) {
        return this.make0(arg)
    }

    static readonly factoryName = 'create'
    static getForASTList(ctor: ASTreeSubCtor): Factory {
        let f = this.get(ctor)
        if (f == null) {
            f = new class extends Factory {
                make0(arg: any): ASTree {
                    const results = arg as ASTree[]
                    if (results.length === 1) {
                        return results[0]
                    } else {
                        return new ASTList(results)
                    }
                }
            }
        }
        return f
    }
    static get<T>(ctor: ASTreeSubCtor): Factory {
        if (ctor == null) {
            return null
        }

        const make = Reflect.get(ctor, 'make')
        if (typeof make === 'function') {
            return new class extends Factory {
                make0(arg: T): ASTree {
                    return make(arg)
                }
            }
        }

        return new class extends Factory {
            make0(arg: T): ASTree {
                return new ctor(arg)
            }
        }
    }
}

export class Parser {
    elements: Element[] = []
    factory: Factory

    constructor(pOrCtor: ASTreeSubCtor | Parser) {
        if (pOrCtor instanceof Parser) {
            this.elements = pOrCtor.elements
            this.factory = pOrCtor.factory
        } else {
            this.reset(pOrCtor)
        }
    }

    async parse(l: l.Lexer): Promise<ASTree> {
        const results: ASTree[] = []
        for (const e of this.elements) {
            await e.parse(l, results)
        }
        return this.factory.make(results)
    }

    number(ctor: ASTLeafSubCtor = null): Parser {
        this.elements.push(new NumToken(ctor))
        return this
    }

    identifier(reserved: Set<string>): Parser
    identifier(ctor: ASTLeafSubCtor, reserved: Set<string>)
    identifier(ctorOrReserved: ASTLeafSubCtor | Set<string>, reserved?: Set<string>): Parser {
        if (ctorOrReserved instanceof Set) {
            this.identifier(null, ctorOrReserved)
        } else {
            this.elements.push(new IdToken(ctorOrReserved, reserved))
        }
        return this
    }

    string(ctor: ASTLeafSubCtor = null): Parser {
        this.elements.push(new StrToken(ctor))
        return this
    }

    sep(...pats: string[]): Parser {
        this.elements.push(new Skip(pats))
        return this
    }

    ast(p: Parser): Parser {
        this.elements.push(new Tree(p))
        return this
    }

    option(p: Parser): Parser {
        this.elements.push(new Repeat(p, true))
        return this
    }

    or(...ps: Parser[]): Parser {
        this.elements.push(new OrTree(ps))
        return this
    }

    repeat(p: Parser): Parser {
        this.elements.push(new Repeat(p, false))
        return this
    }

    expression(p: Parser, ops: Operators): Parser
    expression(ctor: ASTreeSubCtor, p: Parser, ops: Operators): Parser
    expression(ctorOrParser: ASTreeSubCtor | Parser, parserOrOperators: Parser | Operators, ops?: Operators): Parser {
        if (ctorOrParser instanceof Parser && parserOrOperators instanceof Operators) {
            this.elements.push(new Expr(null, ctorOrParser, parserOrOperators))
        } else {
            this.elements.push(new Expr(ctorOrParser as ASTListSubCtor, parserOrOperators as Parser, ops))
        }
        return this
    }

    reset(ctor?: ASTreeSubCtor) {
        this.elements = []
        this.factory = Factory.getForASTList(ctor)
        return this
    }

    async match(lexer: l.Lexer): Promise<boolean> {
        if (this.elements.length == 0) {
            return true
        } else {
            const e = this.elements[0]
            return await e.match(lexer)
        }
    }
}

export function rule(ctor: ASTreeSubCtor = null) {
    return new Parser(ctor)
}
