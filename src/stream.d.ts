/// <reference types="node" />

import {RedisClient} from 'redis'
import {EventEmitter} from 'events'


declare class RedisStream extends EventEmitter {

    constructor(
        names?: string[], 
        group?: string, 
        consumer?: string,
        eventKey?: string, 
        readClient?: RedisClient, 
        writeClient?: RedisClient
    )

    ack(id: string, stream: string): Promise<string>

    add(item: any, stream: string): Promise<string>

}

export = RedisStream