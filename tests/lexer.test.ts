import * as l from '../src/lexer'
import {ContentsLineReader} from './utils'

const expectStringLiteral = (contents: string, expected: string): void => {
    test(contents, async () => {
        const lexer = new l.Lexer(new ContentsLineReader(contents))
        const token = await lexer.read()
        expect(token.isString()).toBe(true)
        expect(token.getText()).toBe(expected)
    })
}

const expectNumber = (contents: string, expected: number): void => {
    test(contents, async () => {
        const lexer = new l.Lexer(new ContentsLineReader(contents))
        const token = await lexer.read()
        expect(token.isNumber()).toBe(true)
        expect(token.getNumber()).toBe(expected)
    })
}

const expectIdentifier = (contents: string, expected: string): void => {
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
