/// <reference types="node" />

import {RedisClient} from 'redis'
import {EventEmitter} from 'events'


declare class RedisPubSub extends EventEmitter {

    constructor(
        redisUrl: string
    )

}

export = RedisStream