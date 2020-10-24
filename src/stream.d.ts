/// <reference types="node" />

import {RedisClient} from 'redis'
import {EventEmitter} from 'events'


interface RedisStreamClientOptions {
    readClient?: RedisClient, 
    writeClient?: RedisClient,
    redisUrl?: string
}

declare class RedisStream extends EventEmitter {

    constructor(
        names: string[], 
        group: string, 
        consumer: string,
        eventKey: string,
        clientOptions?: RedisStreamClientOptions
    )

    ack(id: string, stream: string): Promise<string>
    add(item: any, stream: string): Promise<string>

}

export = RedisStream