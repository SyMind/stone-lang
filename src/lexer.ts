import {IdToken, NumToken, StrToken, Token} from './token'
import {LineReader} from './lineReader'
import {ParseError} from './parseError'

export class Lexer {
    pattern = '\\s*(?:(//.*)|([0-9]*)|("(?:\\"|\\\\\\|\\n|[^"])*")|([A-Z_a-z][A-Z_a-z0-9]*|==|<=|>=|&&|\\|\\|))?'
    queue: Token[] = []
    hasMore = true
    reader: LineReader

    constructor(reader: LineReader) {
        this.reader = reader
    }

    async read(): Promise<Token> {
        if (await this.fillQueue(0)) {
            return this.queue.pop()
        }
        return Token.EOF
    }

    async peek(i: number): Promise<Token> {
        if (await this.fillQueue(i)) {
            return this.queue[i]
        }
        return Token.EOF
    }

    protected async fillQueue(i: number): Promise<boolean> {
        while (i >= this.queue.length)
            if (this.hasMore) {
                await this.readLine()
            } else {
                return false
            }
        return true
    }

    protected async readLine(): Promise<void> {
        let line
        try {
            line = await this.reader.nextLine()
        } catch (error) {
            throw new ParseError(error.message)
        }

        if (line == null) {
            return
        }

        const lineNo = this.reader.getLineNumber()
        const regExp = new RegExp(this.pattern, 'g')
        while (regExp.lastIndex < line.length) {
            const results = regExp.exec(line)
            this.addToken(lineNo, results)
        }
        return
    }

    protected addToken(lineNo: number, results: RegExpExecArray) {
        if (results == null) {
            return
        }

        let token
        if (results[2] != null) {
            token = new NumToken(lineNo, parseInt(results[2], 10))
        } else if (results[3] != null) {
            const raw = results[3]
            const str = raw.substring(1, raw.length - 1)
            token = new StrToken(lineNo, str)
        } else if (results[4] != null) {
            token = new IdToken(lineNo, results[4])
        }
        this.queue.push(token)
    }

    protected toStringLiteral
}
