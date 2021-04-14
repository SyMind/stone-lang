import * as p from './parser'
import * as a from './ast'
import {FuncParser} from './funcParser'

export class ClosureParser extends FuncParser {
    constructor() {
        super()
        this.primary.insertChoice(p.rule(a.Func).sep('func').ast(this.paramList).ast(this.block))
    }
}
