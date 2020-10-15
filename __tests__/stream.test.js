const { RedisStream } = require('../src/stream')

const mystream = new RedisStream(['mystream'], 'mygroup', 'hakrac', 'channel')

mystream.on('hello', item => {
    console.log(item.message)
})

mystream.on('bye', item => {
    console.log(item.message)
})


mystream.add({
    channel: 'hello',
    message: 'hello'
}).then(() => 
    mystream.add({
        channel: 'bye',
        message: 'bye'
    })
)
