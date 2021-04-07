const p = require('../lib/parser')
const l = require('../lib/lexer')
const {ASTLeaf} = require('../lib/ast')
const {ContentsLineReader} = require('./utils')

async function expectASTList(combinator, contents, expected) {
    const lexer = new l.Lexer(new ContentsLineReader(contents))
    const astList = []
    await combinator.parse(lexer, astList)
    expect(astList.length).toBe(expected.length)
    for (let i = 0; i < astList.length; i++) {
        expect(astList[i].constructor).toBe(expected[i].constructor)
        if (astList[i] instanceof ASTLeaf) {
            expect(astList[i].token).toEqual(expected[i].token)
        }
    }
}

const reserved = new Set([',', '}', l.Token.EOL])

describe('element', () => {
    it('skip', async () => {
        await expectASTList(new p.Skip(['(']), '(', [])
    })
    it('id token', async () => {
        await expectASTList(new p.IdToken(ASTLeaf, reserved), 'foo', [new ASTLeaf(new l.IdToken(0, 'foo'))])
    })
    it('num token', async () => {
        await expectASTList(new p.NumToken(ASTLeaf, reserved), '10', [new ASTLeaf(new l.NumToken(0, 10))])
    })
    it('str token', async () => {
        await expectASTList(new p.StrToken(ASTLeaf, reserved), '"hello,world"', [new ASTLeaf(new l.StrToken(0, 'hello,world'))])
    })
})
