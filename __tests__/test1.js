const RedisStream = require("../src/stream")

let stream = new RedisStream(
    "mystream",
    "mygroup",
    "myconsumer1",
    {
        redisUrl: "redis://localhost"
    }
)

stream.emit("mystream", {
    text: "hello"
})