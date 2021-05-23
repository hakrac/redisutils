const RedisStream = require("../src/stream")

try {
    let stream = new RedisStream(
        "mystream",
        "mygroup1",
        "myconsumer1",
        {
            redisUrl: "redis://localhost"
        }
    )
    
    let stream2 = new RedisStream(
        "mystream",
        "mygroup1",
        "myconsumer2",
        {
            redisUrl: "redis://localhost"
        }
    )

    stream.on("mystream", (message) => {
        console.log("1: ", message)
    })

    stream2.on("mystream", (message) => {
        console.log("2: ", message)
    })

} catch {

}