import * as a from './ast'
import * as p from './parser'
import {BasicParser} from './basicParser'

export class FuncParser extends BasicParser {
    // param       : IDENTIFIER
    param = p.rule().identifier(this.reserved)
    // params      : param { "," param }
    params = p.rule(a.ParameterList).ast(this.param).repeat(p.rule().sep(',').ast(this.param))
    // param_list  : "(" [ params ] ")"
    paramsList = p.rule().sep('(').maybe(this.params).sep(')')
    // def         : "def" IDENTIFIER param_list block
    def = p.rule(a.DefStmnt).sep('def').identifier(this.reserved).ast(this.paramsList).ast(this.block)
    // args        : expr { "," expr }
    args = p.rule(a.Arguments as any).ast(this.expr).repeat(p.rule().sep(',').ast(this.expr))
    // postfix     : "(" [ args ] ")"
    postfix = p.rule().sep('(').maybe(this.args).sep(')')

    constructor() {
        super()

        this.reserved.add(')')

        // primary     : ( "(" expr ")" | NUMBER | IDENTIFIER | STRING ) { postfix }
        this.primary.repeat(this.postfix)
        // simple      : expr [ args ]
        this.simple.option(this.args)
        // porgram     : [ def | statement ] (";" | EOL)
        this.program.insertChoice(this.def)
    }
}
