/// <reference types="node" />

import {RedisClient} from 'redis'
import {EventEmitter} from 'events'


interface RedisStreamClientOptions {
    redisUrl?: string
}

declare class RedisStream extends EventEmitter {

    constructor(
        name: string, 
        group: string, 
        consumer: string,
        clientOptions?: RedisStreamClientOptions
    )

    ack(id: string, stream: string): Promise<string>
    add(item: any, stream: string): Promise<string>

}

export = RedisStream