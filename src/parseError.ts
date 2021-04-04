export class ParseError extends Error {
    constructor(m: string)
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ParseError.prototype);
    }
}
