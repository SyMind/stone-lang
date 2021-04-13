import * as l from '../src/lexer'
import {FuncParser} from '../src/funcParser'
import {BasicEnv, NestedEnv} from '../src/env'
import {ContentsLineReader} from './utils'

test('func parser', async () => {
    const reader = new ContentsLineReader(
        `def fib (n) {
            if n < 2 {
                n
            } else {
                fib(n - 1) + fib(n - 2)
            }
        }
        fib(10)`
    )
    const lexer = new l.Lexer(reader)
    const parser = new FuncParser()
    const env = new NestedEnv()
    let stringify = ''
    let result
    while (await lexer.peek(0) != l.Token.EOF) {
        const ast = await parser.parse(lexer)
        result = ast.eval(env)
        stringify += ast.toString()
    }
    expect(stringify).toBe('(def fib (n) ((if ((n) < (2)) ((n)) else (((fib (((n) - (1)))) + (fib (((n) - (2)))))))))(fib ((10)))')
    expect(result).toBe(55)
})
