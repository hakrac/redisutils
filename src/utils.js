const RedisStream = require('./stream')
const redis = require('redis')

let a = new RedisStream(['test'], 'test', 'teest', 'test', { readClient: redis.createClient('test')})