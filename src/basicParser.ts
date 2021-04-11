import * as p from './parser';
import * as l from './lexer'
import {ASTree, BinaryExpr, IfStmnt, WhileStmnt, NullStmnt, NumberLiteral, Name, StringLiteral} from './ast'

export class BasicParser {
    reserved = new Set<string>()
    operators = new p.Operators()
    program: p.Parser

    constructor() {
        this.reserved.add(',')
        this.reserved.add('}')
        this.reserved.add(l.Token.EOL)

        this.operators.add('=', 1, p.Operators.RIGHT)
        this.operators.add('==', 2, p.Operators.LEFT)
        this.operators.add('>', 2, p.Operators.LEFT)
        this.operators.add('<', 2, p.Operators.LEFT)
        this.operators.add('+', 3, p.Operators.LEFT)
        this.operators.add('-', 3, p.Operators.LEFT)
        this.operators.add('*', 4, p.Operators.LEFT)
        this.operators.add('/', 4, p.Operators.LEFT)
        this.operators.add('%', 4, p.Operators.LEFT)

        // primary   : "(" expr ")" | NUMBER | IDENTIFIER | STRING
        const expr = p.rule()
        const primary = p.rule().or(
            p.rule().sep('(').ast(expr).sep(')'),
            p.rule().number(NumberLiteral),
            p.rule().identifier(Name, this.reserved),
            p.rule().string(StringLiteral)
        )
        // factor    : "-" primary | primary
        const factor = p.rule().or(
            p.rule().sep('-').ast(primary),
            primary
        )
        // expr      : factor { OP factor }
        expr.expression(BinaryExpr, factor, this.operators)
        // block     : "{" [ statement ] {(";" | EOL) [ statement ]} "}"
        const statement = p.rule()
        const block = p.rule().sep('{').option(statement).repeat(
            p.rule().sep(';', l.Token.EOL).option(statement)
        ).sep('}')
        // simple    : expr
        const simple = p.rule().ast(expr)
        // statement : "if" expr block [ "else" block ]
        //   | "while" expr block
        //   | simple
        statement.or(
            p.rule(IfStmnt).sep('if').ast(expr).ast(block).option(p.rule().sep('else').ast(block)),
            p.rule(WhileStmnt).sep('while').ast(expr).ast(block),
            simple
        )
        // program   : [ statement ] (";" | EOL)
        this.program = p.rule().or(statement, p.rule(NullStmnt)).sep(';', l.Token.EOL)
    }

    async parse(l: l.Lexer): Promise<ASTree> {
        return await this.program.parse(l)
    }
}
