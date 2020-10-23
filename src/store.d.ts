/// <reference types="node" />

declare class RedisStore {
    constructor(
        redisUrl: string
    )

    async get(key: string): string | object | undefined
    set(key: string, value: string | number | object): Promise<boolean>
}

export = RedisStore