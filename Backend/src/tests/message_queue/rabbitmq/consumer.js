const amqp = require('amqplib')
const messages = 'Hello world!'

const runConsumer = async () => {
    try{
        const connection = await amqp.connect('amqp://admin:123456@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.consume(queueName, (messages) => {
            console.log(`Recevied ${messages.content.toString()}`)
        },{
            ack: true
        })
    }
    catch(error){
        console.error(error)
    }
}

runConsumer().catch(console.error)