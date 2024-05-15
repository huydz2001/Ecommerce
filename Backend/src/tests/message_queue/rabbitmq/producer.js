const amqp = require('amqplib')
const messages = 'Alo 1234 test '

const runProducer = async () => {
    try{
        const connection = await amqp.connect('amqp://admin:123456@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        // send message to consummer channel
        channel.sendToQueue(queueName, Buffer.from(messages))
        console.log('message sent::', messages)
    }
    catch(error){
        console.error(error)
    }
}

runProducer().catch(console.error)