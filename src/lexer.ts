import os from 'os'
import {StoneError, ParseError} from './errors'
import {LineReader} from './lineReader'

export abstract class Token {
    static readonly EOF = new class extends Token{}(-1)
    static readonly EOL = os.EOL

    private lineNumber: number

    constructor(lineNum: number) {
        this.lineNumber = lineNum
    }

    getLineNumber(): number {
        return this.lineNumber
    }

    isIdentifier(): boolean {
        return false
    }

    isNumber(): boolean {
        return false
    }

    isString(): boolean {
        return false
    }

    getNumber(): number {
        throw new StoneError('not number token')
    }

    getText(): string {
        return ''
    }
}

export class NumToken extends Token {
    private value: number

    constructor(lineNum: number, v: number) {
        super(lineNum)
        this.value = v
    }

    isNumber(): boolean {
        return true
    }

    getText(): string {
        return this.value + ''
    }

    getNumber(): number {
        return this.value
    }
}

export class IdToken extends Token {
    private text: string

    constructor(lineNum: number, id: string) {
        super(lineNum)
        this.text = id
    }

    isIdentifier(): boolean {
        return true
    }

    getText(): string {
        return this.text
    }
}

export class StrToken extends Token {
    private literal: string

    constructor(lineNum: number, str: string) {
        super(lineNum)
        this.literal = str
    }

    isString(): boolean {
        return true
    }

    getText(): string {
        return this.literal
    }
}

export class Lexer {
    pattern = '\\s*(?:(//.*)|([0-9]*)|("(?:\\"|\\\\\\|\\n|[^"])*")|([A-Z_a-z][A-Z_a-z0-9]*|==|<=|>=|&&|\\|\\||\\(|\\)|\\*|\\+|-|/))?'
    queue: Token[] = []
    hasMore = true
    reader: LineReader

    constructor(reader: LineReader) {
        this.reader = reader
    }

    async read(): Promise<Token> {
        if (await this.fillQueue(0)) {
            return this.queue.shift()
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
            if (results[0]) {
                this.addToken(lineNo, results)
            } else {
                throw new ParseError(`bad token at line ${lineNo}`)
            }
        }
        return
    }

    protected addToken(lineNo: number, results: RegExpExecArray) {
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
}
