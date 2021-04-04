export class StoneError extends Error {
    constructor(m: string)
    constructor(m: string, t?: any) {
        super(m);
        Object.setPrototypeOf(this, StoneError.prototype);
    }
}
