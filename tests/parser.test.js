const p = require('../lib/parser')
const l = require('../lib/lexer')
const {BinaryExpr, ASTLeaf, Name} = require('../lib/ast')
const {ContentsLineReader} = require('./utils')

async function expectASTList(combinator, contents, expected) {
    const lexer = new l.Lexer(new ContentsLineReader(contents))
    const astList = []
    await combinator.parse(lexer, astList)
    expect(astList.length).toBe(expected.length)
    for (let i = 0; i < astList.length; i++) {
        expect(astList[i].toString()).toEqual(expected[i])
    }
}

const reserved = new Set([',', '}', l.Token.EOL])

describe('element', () => {
    it('skip', async () => {
        await expectASTList(new p.Skip(['(']), '(', [])
    })
    it('id token', async () => {
        await expectASTList(new p.IdToken(ASTLeaf, reserved), 'foo', ['foo'])
    })
    it('num token', async () => {
        await expectASTList(new p.NumToken(ASTLeaf, reserved), '10', ['10'])
    })
    it('str token', async () => {
        await expectASTList(new p.StrToken(ASTLeaf, reserved), '"hello,world"', ['hello,world'])
    })
    it('expr', async () => {
        const factor = p.rule().identifier(Name, reserved)
        const operators = new p.Operators()
        operators.add('+', 3, p.Operators.LEFT)
        operators.add('*', 4, p.Operators.LEFT)
        await expectASTList(new p.Expr(BinaryExpr, factor, operators), 'a + b', ['((a) + (b))'])
        await expectASTList(new p.Expr(BinaryExpr, factor, operators), 'a + b * c', ['((a) + ((b) * (c)))'])
    })
})
