import {Primitive} from './types'
import {StoneError} from './errors'

export interface Environment {
    put(name: string, value: Primitive): void
    get(name: string): Primitive
}

export class BasicEnv implements Environment {
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
}
