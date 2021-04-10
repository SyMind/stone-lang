const p = require('../src/parser')
const l = require('../src/lexer')
const {Name, NumberLiteral, StringLiteral} = require('../src/ast')
const {ContentsLineReader} = require('./utils')

async function expectASTList(parser, contents, expected) {
    const lexer = new l.Lexer(new ContentsLineReader(contents))
    const ast = await parser.parse(lexer)
    expect(ast.toString()).toBe(expected)
}

const reserved = new Set([',', '}', l.Token.EOL])

describe('element', () => {
    it('sep', async () => {
        await expectASTList(p.rule().sep('('), '(', '()')
    })
    it('id token', async () => {
        await expectASTList(p.rule().identifier(reserved), 'foo', 'foo')
    })
    it('num token', async () => {
        await expectASTList(p.rule().number(), '10', '10')
    })
    it('str token', async () => {
        await expectASTList(new p.rule().string(), '"hello,world"', 'hello,world')
    })
    it('expr', async () => {
        const factor = p.rule().identifier(Name, reserved)
        const operators = new p.Operators()
        operators.add('+', 3, p.Operators.LEFT)
        operators.add('*', 4, p.Operators.LEFT)
        await expectASTList(new p.rule().expression(factor, operators), 'a + b', '(a + b)')
        await expectASTList(new p.rule().expression(factor, operators), 'a + b * c', '(a + (b * c))')
    })
    it('or', async () => {
        const reserved = new Set([',', '}', l.Token.EOL])
        const primary = p.rule().or(
            p.rule().number(NumberLiteral),
            p.rule().identifier(Name, reserved),
            p.rule().string(StringLiteral)
        )
        await expectASTList(primary, 'a', 'a')
    })
})
