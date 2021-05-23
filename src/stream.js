const redis = require('redis')
const {EventEmitter} = require('events')
const { promisify } = require('util')

const parseItem = (itemData) => {
    let [
        streamname, 
        [
            [
                id, 
                [$1, type, $2, payload]
            ]
        ]
    ] = itemData

    let item = {
        stream: streamname,
        id,
        type,
        payload: JSON.parse(payload)
    }

    // for(let i = 0; i < (values.length - 1); i += 2) {
    //     item.payload[values[i]] = values[i + 1]
    // }
    return item
}

const parseStreams = (streamsData) => {
    let items = []
    for(let item of streamsData) {
        items.push(parseItem(item))
    }
    return items
}

const serializeItem = (item) => {
    let result = ["type", item.type]
    // for(let key of Object.keys(item.payload)) {
    //     if(typeof item.payload[key] !== 'undefined') {
    //         result.push(key, item.payload[key].toString())
    //     }
    // }
    result.push("payload", JSON.stringify(item.payload))
    return result
}

const GROUP = "GROUP"
const CREATE = "CREATE"
const MKSTREAM = "MKSTREAM"
const BLOCK = "BLOCK"
const NOACK = "NOACK"
const STREAMS = "STREAMS"

class RedisStream extends EventEmitter {

    constructor(name, group, consumer, {redisUrl}) {
        super()
        this.stream = name
        this.group = group
        this.consumer = consumer
        this.eventKey = "type"
        this._readClient = redis.createClient(redisUrl)
        this._writeClient = redis.createClient(redisUrl)
        this.eventEmitter = new EventEmitter()

        
        // @ts-ignore
        this._writeClient.xgroup(CREATE, this.stream, this.group, '$', MKSTREAM, () => {

            let onReceive = (err, value) => {
                if(err) {
                    // error
                } else {
                    let items = parseStreams(value)
                    for(let item of items) {
                        let event = item[this.eventKey]
                        if(typeof event === "string") {
                            this.eventEmitter.emit(event, item.payload)
                        } else {
                            this.eventEmitter.emit("data", item)
                        }
                        this.ack(item.id)
                    }
                }
                // @ts-ignore
                this._readClient.xreadgroup(GROUP, this.group, this.consumer, BLOCK, 0, NOACK, STREAMS, this.stream, '>', onReceive)
            }
    
            // @ts-ignore
            this._readClient.xreadgroup(GROUP, this.group, this.consumer, BLOCK, 0, NOACK, STREAMS, this.stream, '>', onReceive)
        
        })
    }

    get connected() {
        return this._readClient.connected
    }

    ack(id) {
        return promisify(
            // @ts-ignore
            cb => this._writeClient.xack(GROUP, this.group, this.stream, id, cb)
        )()
    }

    on(event, cb) {
        this.eventEmitter.on(event, cb)
        return this
    }

    emit(event, item) {
        promisify(
            // @ts-ignore
            cb => this._writeClient.xadd(this.stream, '*', ...serializeItem({type: event, payload: item}), cb)
        )()

        return true
    }

}

module.exports = RedisStream
