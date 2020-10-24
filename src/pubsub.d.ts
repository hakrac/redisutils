/// <reference types="node" />

import {RedisClient} from 'redis'
import {EventEmitter} from 'events'

interface RedisPubSubClientOptions {
    publisherClient?: RedisClient,
    subscriberClient?: RedisClient,
    redisUrl?: string
}

declare class RedisPubSub extends EventEmitter {

    constructor(RedisPubSubClientOptions?)

    emit(
        event: string,
        message: string
    )
}

export = RedisStream