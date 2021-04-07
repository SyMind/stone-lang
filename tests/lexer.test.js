const l = require('../lib/lexer')
const {ContentsLineReader} = require('./utils')

const expectStringLiteral = (contents, expected) => {
    test(contents, async () => {
        const lexer = new l.Lexer(new ContentsLineReader(contents))
        const token = await lexer.read()
        expect(token.isString()).toBe(true)
        expect(token.getText()).toBe(expected)
    })
}

const expectNumber = (contents, expected) => {
    test(contents, async () => {
        const lexer = new l.Lexer(new ContentsLineReader(contents))
        const token = await lexer.read()
        expect(token.isNumber()).toBe(true)
        expect(token.getNumber()).toBe(expected)
    })
}

const expectIdentifier = (contents, expected) => {
    test(contents, async () => {
        const lexer = new l.Lexer(new ContentsLineReader(contents))
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
        expectIdentifier('(', '(')
        expectIdentifier(')', ')')
        expectIdentifier('+', '+')
        expectIdentifier('-', '-')
        expectIdentifier('*', '*')
        expectIdentifier('/', '/')
    })
})
