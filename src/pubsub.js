const { EventEmitter } = require('events')
const redis = require('redis')

class RedisPubSub extends EventEmitter {
    
    constructor(redisUrl) {
        super()
        this.subscriber = redis.createClient(redisUrl)
        this.publisher = redis.createClient(redisUrl)
    }

    once(event, handler) {
        this.subscriber.subscribe(event, (...args) => {
            handler(...args)
            this.subscriber.unsubscribe(event)
        })
        return this
    }

    addListener(event, handler) {
        this.subscriber.subscribe(event, handler)
        return this
    }

    on(event, handler) {
        return this.addListener(event, handler)
    }

    emit(event, value) {
        return this.publisher.publish(event, value.toString())
    }
}

module.exports = RedisPubSub