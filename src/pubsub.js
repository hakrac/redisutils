const { EventEmitter } = require('events')
const redis = require('redis')
const { promisify } = require('util')

class RedisPubSub extends EventEmitter {
    
    constructor({publisherClient, subscriberClient, redisUrl}) {
        super()
        this.subscriber = subscriberClient || redis.createClient(redisUrl)
        this.publisher = publisherClient || redis.createClient(redisUrl)
        this.emitter = new EventEmitter()

        this.subscriber.on('message', (channel, message) => {
            console.log('message')
            this.emitter.emit(channel, message)
        })
    }

    on(event, handler) {
        this.subscriber.subscribe(event)
        this.emitter.on(event, handler)
        return this
    }

    once(event, handler) {
        this.subscriber.subscribe(event)
        this.emitter.once(event, handler)
        return this
    }

    addListener(event, handler) {
        this.subscriber.subscribe(event)
        this.emitter.on(event, handler)
        return this
    }

    emit(event, message) {
        return this.publisher.publish(event, message)
    }
}

module.exports = RedisPubSub