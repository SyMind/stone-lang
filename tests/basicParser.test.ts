import * as l from '../src/lexer'
import {BasicParser} from '../src/basicParser'
import {BasicEnv} from '../src/env'
import {ContentsLineReader} from './utils'

test('empty statement', async () => {
    const reader = new ContentsLineReader('')
    const lexer = new l.Lexer(reader)
    const parser = new BasicParser()
    const ast = await parser.parse(lexer)
    expect(ast.toString()).toBe('()')
})

test('basic parser', async () => {
    const reader = new ContentsLineReader(
        `odd = 0
        even = 0
        i = 1
        while i < 10 {
            if i % 2 == 0 {
                even = even + i
            } else {
                odd = odd + i
            }
            i = i + 1
        }`
    )
    const lexer = new l.Lexer(reader)
    const parser = new BasicParser()
    const basicEnv = new BasicEnv()
    let stringify = ''
    while (await lexer.peek(0) != l.Token.EOF) {
        const ast = await parser.parse(lexer)
        ast.eval(basicEnv)
        stringify += ast.toString()
    }
    expect(stringify).toBe('(odd = 0)(even = 0)(i = 1)(while (i < 10) ((if ((i % 2) == 0) ((even = (even + i))) else ((odd = (odd + i)))) (i = (i + 1))))')
    expect(basicEnv.get('odd')).toBe(25)
    expect(basicEnv.get('even')).toBe(20)
})
