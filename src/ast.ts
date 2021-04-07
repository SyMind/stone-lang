import * as l from './lexer'

export abstract class ASTree implements Iterable<ASTree> {
    abstract child(i: number): ASTree
    abstract numChildren(): number
    abstract [Symbol.iterator](): Iterator<ASTree>
    abstract location(): string
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
        for (const child of  this.children) {
            ss.push(child.toString())
        }
        return `(${ss.join(' ')})`
    }
}

export class NumberLiteral extends ASTLeaf {
    value(): number {
        return this.token.getNumber()
    }
}

export class StringLiteral extends ASTLeaf {
    value(): string {
        return this.token.getText()
    }
}

export class Name extends ASTLeaf {
    name(): string {
        return this.token.getText()
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
}

export class IfStmnt extends ASTList {
    condition(): ASTree {
        return this.child[0]
    }
    thenBlock(): ASTree {
        return this.child[1]
    }
    elseBlock(): ASTree {
        return this.numChildren() > 2 ? this.child(2) : null
    }
    toString(): string {
        return `(if ${this.condition()} ${this.thenBlock()} else ${this.elseBlock()})`
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
}

export class NullStmnt extends ASTList {}
