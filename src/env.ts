import {Primitive} from './types'
import {StoneError} from './errors'

export interface Env {
    put(name: string, value: Primitive): void
    get(name: string): Primitive
    putNew(name: string, value: Primitive): void
    where(name: string): Env
    setOuter(e: Env): void
}

export class BasicEnv implements Env {
    values = new Map<string, Primitive>()
    put(name: string, value: Primitive): void {
        this.values.set(name, value)
    }
    get(name: string): Primitive {
        if (this.values.has(name)) {
            return this.values.get(name)
        }
        throw new StoneError(`undefined name: ${name}`)
    }
    putNew(name: string, value: Primitive): void {
        this.put(name, value)
    }
    where(name: string): Env {
        return this
    }
    setOuter(e: Env): void {}
}

export class NestedEnv implements Env {
    protected values = new Map()
    protected outer: NestedEnv
    constructor(outer: NestedEnv = null) {
        this.outer = outer
    }
    setOuter(outer: NestedEnv): void {
        this.outer = outer
    }
    putNew(name: string, value: Primitive): void {
        this.values.set(name, value)
    }
    where(name: string) {
        if (this.values.has(name)) {
            return this
        } else if (this.outer == null) {
            return null
        } else {
            return this.outer.where(name)
        }
    }
    put(name: string, value: Primitive): void {
        let e = this.where(name)
        if (e == null) {
            e = this
        }
        e.putNew(name, value)
    }
    get(name: string): Primitive {
        const v = this.values.get(name)
        if (v == null && this.outer != null) {
            return this.outer.get(name)
        } else {
            return v
        }
    }
}
