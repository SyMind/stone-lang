import os from 'os'
import {StoneError} from './stoneError'

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
