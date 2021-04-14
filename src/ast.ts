import * as l from './lexer'
import {Env, NestedEnv} from './env'
import {StoneError} from './errors'
import {Primitive} from './types'

const TRUE = 1
const FALSE = 0

export abstract class ASTree implements Iterable<ASTree> {
    abstract child(i: number): ASTree
    abstract numChildren(): number
    abstract [Symbol.iterator](): Iterator<ASTree>
    abstract location(): string
    abstract eval(env: Env): Primitive
}

export class ASTLeaf extends ASTree {
    private static empty: ASTree[] = []
    protected token: l.Token
    constructor(t: l.Token) {
        super()
        this.token = t
    }
    child(i: number): ASTree {
        throw new Error('index out of bounds')
    }
    numChildren(): number {
        return 0
    }
    *[Symbol.iterator](): Iterator<ASTree> {}
    location(): string {
        return 'at line ' + this.token.getLineNumber()
    }
    toString(): string {
        return this.token.getText()
    }
    getToken(): l.Token {
        return this.token
    }
    eval(env: Env): Primitive {
        throw new StoneError('cannot eval: ' + this.toString())
    }
}

export class ASTList extends ASTree {
    protected children: ASTree[]
    constructor(list: ASTree[]) {
        super()
        this.children = list
    }
    size() {
        return this.children.length
    }
    child(i: number): ASTree {
        return this.children[i]
    }
    numChildren(): number {
        return this.children.length
    }
    *[Symbol.iterator](): Iterator<ASTree> {
        for (const child of this.children) {
            yield child
        }
    }
    location(): string {
        for (const child of this.children) {
            const s = child.location()
            if (s != null) {
                return s
            }
        }
        return null
    }
    toString(): string {
        let ss: string[] = []
        for (const child of this.children) {
            ss.push(child.toString())
        }
        return `(${ss.join(' ')})`
    }
    eval(env: Env): Primitive {
        throw new StoneError('cannot eval: ' + this.toString())
    }
}

export class NumberLiteral extends ASTLeaf {
    value(): number {
        return this.token.getNumber()
    }
    eval(env: Env): number {
        return this.value()
    }
}

export class StringLiteral extends ASTLeaf {
    value(): string {
        return this.token.getText()
    }
    eval(env: Env): string {
        return this.value()
    }
}

export class Name extends ASTLeaf {
    name(): string {
        return this.token.getText()
    }
    eval(env: Env): Primitive {
        return env.get(this.name())
    }
}

export class BinaryExpr extends ASTList {
    left(): ASTree {
        return this.children[0]
    }
    operator(): string {
        return (this.children[1] as ASTLeaf).getToken().getText()
    }
    right(): ASTree {
        return this.children[2]
    }
    eval(env: Env): Primitive {
        const op = this.operator()
        if (op === '=') {
            const right = this.right().eval(env)
            return this.computeAssign(env, right)
        } else {
            const left = this.left().eval(env)
            const right = this.right().eval(env)
            return this.computeOp(left, op, right)
        }
    }
    protected computeAssign(env: Env, rValue: Primitive): Primitive {
        const left = this.left()
        if (left instanceof Name) {
            env.put(left.name(), rValue)
            return rValue
        }
        throw new StoneError('bad assignment')
    }
    protected computeOp(lValue: Primitive, op: string, rValue: Primitive): Primitive {
        if (typeof lValue === 'number' && typeof rValue === 'number') {
            return this.computeNumber(lValue as number, op, rValue as number)
        } else {
            if (op === '+') {
                return String(lValue) + String(rValue)
            } else if (op === '==') {
                if (lValue === null) {
                    return rValue === null ? TRUE : FALSE
                } else {
                    return lValue === rValue ? TRUE : FALSE
                }
            } else {
                throw new StoneError('bad type')
            }
        }
    }
    protected computeNumber(a: number, op: string, b: number): number {
        switch (op) {
            case '+':
                return a + b
            case '-':
                return a - b
            case '*':
                return a * b
            case '/':
                return a / b
            case '%':
                return a % b
            case '==':
                return a === b ? TRUE : FALSE
            case '<':
                return a < b ? TRUE : FALSE
            case '>':
                return a > b ? TRUE : FALSE
            default:
                throw new StoneError('bad operator')
        }
    }
}

export class IfStmnt extends ASTList {
    condition(): ASTree {
        return this.child(0)
    }
    thenBlock(): ASTree {
        return this.child(1)
    }
    elseBlock(): ASTree {
        return this.numChildren() > 2 ? this.child(2) : null
    }
    toString(): string {
        return `(if ${this.condition()} ${this.thenBlock()} else ${this.elseBlock()})`
    }
    eval(env: Env): Primitive {
        const c = this.condition().eval(env)
        if (c !== FALSE) {
            return this.thenBlock().eval(env)
        } else {
            const e = this.elseBlock()
            if (e == null) {
                return 0
            }
            return this.elseBlock().eval(env)
        }
    }
}

export class WhileStmnt extends ASTList {
    condition(): ASTree {
        return this.child(0)
    }
    body(): ASTree {
        return this.child(1)
    }
    toString(): string {
        return `(while ${this.condition()} ${this.body()})`
    }
    eval(env: Env): Primitive {
        let result: Primitive = 0
        for (;;) {
            const c = this.condition().eval(env)
            if (c === FALSE) {
                return result
            } else {
                result = this.body().eval(env)
            }
        }
    }
}

export class BlockStmnt extends ASTList {
    eval(env: Env): Primitive {
        let result: Primitive = 0
        for (const child of this.children) {
            result = child.eval(env)
        }
        return result
    }
}

export class NullStmnt extends ASTList {
    eval(env: Env): Primitive {
        return 0
    }
}

export class ParameterList extends ASTList {
    name(i: number): string {
        return (this.child(i) as ASTLeaf).getToken().getText()
    }
    size(): number {
        return this.numChildren()
    }
    eval(env: Env, index?: number, value?: Primitive): Primitive {
        env.putNew(this.name(index), value)
        return value
    }
}

export class Function {
    parameters: ParameterList
    body: BlockStmnt
    env: NestedEnv
    constructor(parameters: ParameterList, body: BlockStmnt, env: NestedEnv) {
        this.parameters = parameters
        this.body = body
        this.env = env
    }
    makeEnv() {
        return new NestedEnv(this.env)
    }
    toString() {
        return `<func>`
    }
}

export class DefStmnt extends ASTList {
    name(): string {
        return (this.child(0) as ASTLeaf).getToken().getText()
    }
    parameters(): ParameterList {
        return this.child(1) as ParameterList
    }
    body(): BlockStmnt {
        return this.child(2) as BlockStmnt
    }
    toString(): string {
        return `(def ${this.name()} ${this.parameters()} ${this.body()})`
    }
    eval(env: NestedEnv): Primitive {
        env.putNew(this.name(), new Function(this.parameters(), this.body(), env))
        return this.name()
    }
}

export abstract class Postfix extends ASTList {
    abstract eval(env: Env, value?: Primitive): Primitive
}

export class Arguments extends Postfix {
    size(): number {
        return this.numChildren()
    }
    eval(callerEnv: Env, value: Primitive): Primitive {
        if (!(value instanceof Function)) {
            throw new StoneError('bad function')
        }
        const func = value as Function
        const params = func.parameters
        if (this.children.length !== params.size()) {
            throw new StoneError('bad number of arguments')
        }
        const newEnv = func.makeEnv()
        let index = 0
        for (const a of this) {
            params.eval(newEnv, index++, a.eval(callerEnv))
        }
        return func.body.eval(newEnv);
    }
}

export class PrimaryExpr extends ASTList {
    static create(c: ASTree[]): ASTree {
        return c.length === 1 ? c[0] : new PrimaryExpr(c)
    }
    operand(): ASTree {
        return this.child(0)
    }
    postfix(nest: number): Postfix {
        return this.child(this.numChildren() - nest - 1) as Postfix
    }
    hasPostfix(nest: number): boolean {
        return this.numChildren() - nest > 1
    }
    eval(env: Env): Primitive {
        return this.evalSubExpr(env, 0)
    }
    evalSubExpr(env: Env, nest: number) {
        if (this.hasPostfix(nest)) {
            const target = this.evalSubExpr(env, nest + 1)
            return this.postfix(nest).eval(env, target)
        }
        else {
            return this.operand().eval(env)
        }
    }
}

export class Func extends ASTList {
    parameters(): ParameterList {
        return this.child(0) as ParameterList
    }
    body(): BlockStmnt {
        return this.child(1) as BlockStmnt
    }
    toString(): string {
        return `(func ${this.parameters()} ${this.body()})`
    }
    eval(env: NestedEnv) {
        return new Function(this.parameters(), this.body(), env)
    }
}
