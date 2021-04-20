import {ClosureParser} from './closureParser'
import * as l from './lexer'
import * as p from './parser'
import * as a from './ast'

export class ClassParser extends ClosureParser {
    //  member      : def | simple
    member = p.rule().or(this.def, this.simple)
    // class_body  : "{" [ memeber ] { ( ";" | EOL ) } "}"
    class_body = p.rule(a.ClassBody).sep('{').option(this.member).repeat(
        p.rule().sep(';', l.Token.EOL).option(this.member)
    ).sep('}')
    // defclass    : "class" IDENTIFIER [ "extends" IDENTIFIER ] class_body
    defclass = p.rule(a.ClassStmnt).sep('class').identifier(this.reserved).option(
        p.rule().sep('extends').identifier(this.reserved)
    ).ast(this.class_body)

    constructor() {
        super()
        // postfix     : "." IDENTIFIER | "(" [ args ] ")"
        this.postfix.insertChoice(p.rule(a.Dot).sep('.').identifier(this.reserved))
        // program     : [ defclass | def | statement ] ( ";" | EOL )
        this.program.insertChoice(this.defclass)
    }
}
