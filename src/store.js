const redis = require('redis')
const { promisify } = require('util')

const serializeItem = item => {
    let result = []
    for(let key of Object.keys(item)) {
        if(typeof item[key] !== 'undefined') {
            result.push(key, item[key].toString())
        }
    }
    return result
}


class RedisStore  {

    constructor(redisUrl) {
        this._client = redis.createClient(redisUrl)
    }

    async get(key) {
        let value
        try {
            value = await promisify(
                cb => this._client.get(key, cb)
            )()
        } catch(err) {
            if(err instanceof redis.ReplyError) {
                value = await promisify(
                    cb => this._client.hgetall(key, cb)
                )()
            }
        }

        return value
    }

    set(key, value) {
        if(typeof key === 'string') {
            if(typeof value === 'object' && value) {
                return promisify(
                    cb => this._client.hmset(key, serializeItem(value), cb)
                )()
            } else if(typeof value === 'string' || typeof value === 'number') {
                return promisify(
                    cb => this._client.set(key, value.toString(), cb)
                )()
            }
        }
    }

}

module.exports = RedisStore