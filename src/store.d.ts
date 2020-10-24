/// <reference types="node" />

import {RedisClient} from 'redis'

interface RedisStoreClientOptions {
    client?: RedisClient,
    redisUrl: string
}

declare class RedisStore {
    constructor(clientOptions?: RedisStoreClientOptions)

    async get(key: string): string | object | undefined
    set(key: string, value: string | number | object): Promise<boolean>
}

export = RedisStore