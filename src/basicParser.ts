import * as p from './parser'
import * as l from './lexer'
import {ASTree, BinaryExpr, IfStmnt, WhileStmnt, NullStmnt, NumberLiteral, Name, StringLiteral, BlockStmnt, PrimaryExpr} from './ast'

export class BasicParser {
    reserved = new Set<string>()
    operators = new p.Operators()

    // primary   : "(" expr ")" | NUMBER | IDENTIFIER | STRING
    expr0 = p.rule()
    primary = p.rule(PrimaryExpr).or(
        p.rule().sep('(').ast(this.expr0).sep(')'),
        p.rule().number(NumberLiteral),
        p.rule().identifier(Name, this.reserved),
        p.rule().string(StringLiteral)
    )
    // factor    : "-" primary | primary
    factor = p.rule().or(
        p.rule().sep('-').ast(this.primary),
        this.primary
    )
    // expr      : factor { OP factor }
    expr = this.expr0.expression(BinaryExpr, this.factor, this.operators)
    // block     : "{" [ statement ] {(";" | EOL) [ statement ]} "}"
    statement0 = p.rule()
    block = p.rule(BlockStmnt).sep('{').option(this.statement0).repeat(
        p.rule().sep(';', l.Token.EOL).option(this.statement0)
    ).sep('}')
    // simple    : expr
    simple = p.rule().ast(this.expr)
    // statement : "if" expr block [ "else" block ]
    //   | "while" expr block
    //   | simple
    statement = this.statement0.or(
        p.rule(IfStmnt).sep('if').ast(this.expr).ast(this.block).option(p.rule().sep('else').ast(this.block)),
        p.rule(WhileStmnt).sep('while').ast(this.expr).ast(this.block),
        this.simple
    )
    // program   : [ statement ] (";" | EOL)
    program = p.rule().or(this.statement, p.rule(NullStmnt)).sep(';', l.Token.EOL)

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
    }

    async parse(l: l.Lexer): Promise<ASTree> {
        return await this.program.parse(l)
    }
}
