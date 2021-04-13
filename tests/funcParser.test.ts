import * as l from '../src/lexer'
import {FuncParser} from '../src/funcParser'
import {BasicEnv} from '../src/env'
import {ContentsLineReader} from './utils'

test('func parser', async () => {
    const reader = new ContentsLineReader(
        `def fib (n) {
            if n < 2 {
                n
            } else {
                fib(n - 1) + fib(n - 2)
            }
        }`
    )
    const lexer = new l.Lexer(reader)
    const parser = new FuncParser()
    const basicEnv = new BasicEnv()
    let stringify = ''
    while (await lexer.peek(0) != l.Token.EOF) {
        const ast = await parser.parse(lexer)
        ast.eval(basicEnv)
        stringify += ast.toString()
    }
    expect(stringify).toBe('(def fib (n) ((if ((n < 2)) ((n)) else ((((fib (((n - 1)))) + (fib (((n - 2))))))))))')
})
