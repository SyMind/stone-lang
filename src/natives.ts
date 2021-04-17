import {Env} from './env'
import {NativeFunction} from './ast'

function print(obj: any): number {
    console.log(obj)
    return 0
}

export class Natives {
    environment(env: Env): Env {
        this.appendNatives(env)
        return env
    }
    appendNatives(env: Env): void {
        this.append(env, 'print', print)
    }
    append(env: Env, name: string, func: Function): void {
        env.put(name, new NativeFunction('print', func, 1))
    }
}
