import * as l from './lexer'
import {Environment} from './env'
import {StoneError} from './errors'
import {Primitive} from './types'

const TRUE = 1
const FALSE = 0

export abstract class ASTree implements Iterable<ASTree> {
    abstract child(i: number): ASTree
    abstract numChildren(): number
    abstract [Symbol.iterator](): Iterator<ASTree>
    abstract location(): string
    abstract eval(env: Environment): Primitive
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
    eval(env: Environment): Primitive {
        throw new StoneError('cannot eval: ' + this.toString())
    }
}

export class ASTList extends ASTree {
    protected children: ASTree[]
    constructor(list: ASTree[]) {
        super()
        this.children = list
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
    eval(env: Environment): Primitive {
        throw new StoneError('cannot eval: ' + this.toString())
    }
}

export class NumberLiteral extends ASTLeaf {
    value(): number {
        return this.token.getNumber()
    }
    eval(env: Environment): number {
        return this.value()
    }
}

export class StringLiteral extends ASTLeaf {
    value(): string {
        return this.token.getText()
    }
    eval(env: Environment): string {
        return this.value()
    }
}

export class Name extends ASTLeaf {
    name(): string {
        return this.token.getText()
    }
    eval(env: Environment): Primitive {
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
    eval(env: Environment): Primitive {
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
    protected computeAssign(env: Environment, rValue: Primitive): Primitive {
        const left = this.left()
        if (left instanceof Name) {
            env.put(left.name(), rValue)
            return rValue
        }
        throw new StoneError('bad assignment')
    }
    protected computeOp(lValue: Primitive, op: string, rValue: Primitive): Primitive {
        if (typeof lValue === 'number' && typeof rValue === 'number') {
            return this.computeNumber(lValue as number, op, rValue as number);
        } else {
            if (op === '+') {
                return String(lValue) + String(rValue)
            } else if (op === '==') {
                if (lValue === null) {
                    return rValue === null ? TRUE : FALSE;
                } else {
                    return lValue === rValue ? TRUE : FALSE;
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
    eval(env: Environment): Primitive {
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
    eval(env: Environment): Primitive {
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
    eval(env: Environment): Primitive {
        let result: Primitive = 0
        for (const child of this.children) {
            result = child.eval(env)
        }
        return result
    }
}

export class NullStmnt extends ASTList {
    eval(env: Environment): Primitive {
        return 0
    }
}
