import * as l from '../src/lexer'
import {BasicParser} from '../src/basicParser'
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
        i = 1
        while i < 10 {
            if 1 % 2 == 0 {
                even = even + i
            } else {
                odd = odd + i
            }
            i = i + 1
        }`
    )
    const lexer = new l.Lexer(reader)
    const parser = new BasicParser()
    let astStr = ''
    while (await lexer.peek(0) != l.Token.EOF) {
        const ast = await parser.parse(lexer)
        astStr += ast.toString()
    }
    expect(astStr).toBe('(odd = 0)(i = 1)(while (i < 10) ((if ((1 % 2) == 0) (even = (even + i)) else (odd = (odd + i))) (i = (i + 1))))')
})
