import * as l from '../src/lexer'
import {ClassParser} from '../src/classParser'
import {NestedEnv} from '../src/env'
import {ContentsLineReader} from './utils'

test('func parser', async () => {
    const reader = new ContentsLineReader(
        `class Position {
            x = 0
            def move () {
                x * 2
            }
        }
        p = Position.new
        p.x = 4
        p.move()`
    )
    const lexer = new l.Lexer(reader)
    const parser = new ClassParser()
    const env = new NestedEnv()
    let stringify = ''
    let result
    while (await lexer.peek(0) != l.Token.EOF) {
        const ast = await parser.parse(lexer)
        result = ast.eval(env)
        stringify += ast.toString()
    }
    expect(stringify).toBe('(class Position * ((x = 0) (def move () ((x * 2)))))(p = (Position .new))((p .x) = 4)(p .move ())')
    expect(result).toBe(8)
})
