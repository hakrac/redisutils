const redis = require('redis')
const {EventEmitter} = require('events')
const { promisify } = require('util')

const parseItem = (itemData) => {
    let [streamname, [[id, values]]] = itemData
    let item = {
        stream: streamname,
        id,
        data: {}
    }
    for(let i = 0; i < (values.length - 1); i += 2) {
        item.data[values[i]] = values[i + 1]
    }
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
    let result = []
    for(let key of Object.keys(item)) {
        result.push(key, item[key])
    }
    return result
}

const GROUP = "GROUP"
const CREATE = "CREATE"
const MKSTREAM = "MKSTREAM"
const BLOCK = "BLOCK"
const NOACK = "NOACK"
const STREAMS = "STREAMS"

class RedisStream extends EventEmitter {

    constructor(names, group, consumer, eventKey, readClient, writeClient) {
        super()
        this.streams = names
        this.group = group
        this.consumer = consumer
        this.eventKey = eventKey
        this._readClient = readClient || redis.createClient()
        this._writeClient = writeClient || redis.createClient()

        this.streams.forEach(async stream => {
            await promisify(
                cb => this._writeClient.xgroup(CREATE, stream, this.group, '$', MKSTREAM, cb)
            )()
        })

        let onReceive = (err, value) => {
            if(err) {
                // error
            } else {
                let items = parseStreams(value)
                for(let item of items) {
                    let event = item.data[this.eventKey]
                    if(typeof event === "string") {
                        this.emit(event, item.data)
                    } else {
                        this.emit("data", item.data)
                    }
                }
            }
            this._readClient.xreadgroup(GROUP, this.group, this.consumer, BLOCK, 0, NOACK, STREAMS, ...this.streams, '>', onReceive)
        }

        this._readClient.xreadgroup(GROUP, this.group, this.consumer, BLOCK, 0, NOACK, STREAMS, ...this.streams, '>', onReceive)
    }

    get connected() {
        return this._readClient.connected
    }

    ack(id, stream) {
        if(!stream) {
            stream = this.streams[0]
        }
        return promisify(
            cb => this._writeClient.xack(GROUP, this.group, stream, id, cb)
        )()
    }

    add(item, stream) {
        if(!stream) {
            stream = this.streams[0]
        }
        return promisify(
            cb => this._writeClient.xadd(stream, '*', ...serializeItem(item), cb)
        )()
    }

}

module.exports = RedisStream
