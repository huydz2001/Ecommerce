const amqp = require('amqplib')
const messages = 'Alo 1234 test '

const consumerOrderedMessage = async () => {
    try {
        const connection = await amqp.connect('amqp://admin:123456@localhost')
        const channel = await connection.createChannel()

        const queueName = 'ordered-queued-message'
        await channel.assertQueue(queueName, {
            durable: true
        })

        // Set prefetch to 1 to ensure only one ack at time

        channel.prefetch(1)

        channel.consume(queueName, msg => {
            const message = msg.content.toString()
            setTimeout(() => {
                console.log(`processed:`, message)
                channel.ack(msg)
            }, Math.random() * 1000)
        })
    }
    catch (error) {
        console.error(error)
    }
}

consumerOrderedMessage().catch(console.error)