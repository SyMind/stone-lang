import * as l from '../src/lexer'
import {ClosureParser} from '../src/closureParser'
import {NestedEnv} from '../src/env'
import {Natives} from '../src/natives'
import {ContentsLineReader} from './utils'

test('func parser', async () => {
    const reader = new ContentsLineReader(
        `def counter (c) {
            func () {
                c = c + 10
            }
        }
        c1 = counter(0)
        res = c1()
        print(res)
        `
    )
    const lexer = new l.Lexer(reader)
    const parser = new ClosureParser()
    const env = new Natives().environment(new NestedEnv())
    let stringify = ''
    let result
    while (await lexer.peek(0) != l.Token.EOF) {
        const ast = await parser.parse(lexer)
        result = ast.eval(env)
        stringify += ast.toString()
    }
    // expect(stringify).toBe('(def counter (c) ((func () ((c = (c + 10))))))(c1 = (counter (0)))(c1 ())')
    expect(result).toBe(0)
})
