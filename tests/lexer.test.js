const {Lexer} = require('../lib/lexer')
const {Token} = require('../lib/token')

class ContentsLineReader {
    constructor(contents) {
        this.lines = contents.split(Token.EOL)
        this.lineNumber = -1
    }

    getLineNumber() {
        return this.lineNumber
    }

    async nextLine() {
        if (this.lineNumber >= this.lines.length) {
            return Token.EOF
        }

        ++this.lineNumber
        return this.lines[this.lineNumber]
    }
}

const expectStringLiteral = (contents, expected) => {
    test(contents, async () => {
        const lexer = new Lexer(new ContentsLineReader(contents))
        const token = await lexer.read()
        expect(token.isString()).toBe(true)
        expect(token.getText()).toBe(expected)
    })
}

const expectNumber = (contents, expected) => {
    test(contents, async () => {
        const lexer = new Lexer(new ContentsLineReader(contents))
        const token = await lexer.read()
        expect(token.isNumber()).toBe(true)
        expect(token.getNumber()).toBe(expected)
    })
}

const expectIdentifier = (contents, expected) => {
    test(contents, async () => {
        const lexer = new Lexer(new ContentsLineReader(contents))
        const token = await lexer.read()
        expect(token.isIdentifier()).toBe(true)
        expect(token.getText()).toBe(expected)
    })
}

describe('lexer', () => {
    describe('string literal', () => {
        expectStringLiteral('"123"', '123')
        expectStringLiteral('""', '')
    })

    describe('number', () => {
        expectNumber('123', 123)
    })

    describe('identifier', () => {
        expectIdentifier('abc', 'abc')
    })
})
