'use strict'


const { consumerQueue, consumerToQueueFailed, consumerToQueueNormal } = require('./src/services/consumerQueue.service')
const queueName = 'test-topic'


// consumerQueue(queueName).then(() => {
//     console.log(`Message consumer started ${queueName}`)
// }).catch(err => {
//     console.error(`Message Error: ${err.message}`)
// })


consumerToQueueNormal(queueName).then(() => {
    console.log(`Message consumer started ${queueName}`)
}).catch(err => {
    console.error(`Message Error: ${err.message}`)
})


consumerToQueueFailed(queueName).then(() => {
    console.log(`Message consumer started ${queueName}`)
}).catch(err => {
    console.error(`Message Error: ${err.message}`)
})