# High level redis utility

A high level redis node js utility based on `node-redis`.

### `RedisPubSub`

Publish/Subscribe pattern built into node js `EventEmitter`.

To subscribe run

```javascript
const brokerA = new RedisPubSub({
    redisUrl: "redis://localhost"
})

brokerA.on("PING", message => {
    console.log(`Emitted ${message} on PING event`)
})
```

You can now connect to the same redis server and emit the event `PING` from anywhere.

```javascript
const brokerB = new RedisPubSub({
    redisUrl: "redis://localhost"
})

brokerB.emit("PING", JSON.stringify({hello: "hello"}))
```


### `RedisStream`

Utilizes an underlying redis stream to distribute messages in a queue.

```javascript
const stream = new RedisStream(
    ["mystream"],    // all streams to listen on for events
    "mygroup1",      // consumer group
    "myconsumer",    // consumer name
    "event",         // event key
    redis.createClient("redis://localhost"), 
    redis.createClient("redis://localhost")
)
stream.add({event: "mystream"}, "mystream")
```

### `RedisStore`

Acts as a simple dictionary store.

```javascript
const configStore = new RedisStore({
    redisUrls: "redis://localhost"
})

configStore["foo"] = "bar"

configStore["foo"]
    .then(console.log)
// bar
```