import * as l from './lexer'

function location(token: l.Token): string {
    if (token === l.Token.EOF) {
        return 'the last line'
    } else {
        return `\"${token.getText()}\" at line ${token.getLineNumber()}`
    }
}

export class ParseError extends Error {
    constructor(token: l.Token)
    constructor(msg: string)
    constructor(msg: string, token: l.Token)
    constructor(a: l.Token | string, b?: l.Token) {
        let msg = '', token
        if (typeof a === 'string') {
            msg = a
        } else {
            token = b
        }
        super(token ? `syntax error around ${location(token)}. ${msg}` : msg)
        Object.setPrototypeOf(this, ParseError.prototype)
    }
}

export class StoneError extends Error {
    constructor(m: string)
    constructor(m: string, t?: any) {
        super(m)
        Object.setPrototypeOf(this, StoneError.prototype)
    }
}
