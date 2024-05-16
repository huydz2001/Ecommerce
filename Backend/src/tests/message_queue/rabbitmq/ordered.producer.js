const amqp = require('amqplib')

const consumerOrderedMessage = async () => {
    try{
        const connection = await amqp.connect('amqp://admin:123456@localhost')
        const channel = await connection.createChannel()

        const queueName = 'ordered-queued-message'
        await channel.assertQueue(queueName, {
            durable: true
        })

        for(let i = 0; i< 10; i++){
            const message = `order-queued-message::${i}`
            console.log(message)
            channel.sendToQueue(queueName, Buffer.from(message), {
                persistent: true
            })
        }

        setTimeout(() => {
            connection.close()
        }, 1000)
    }
    catch(error){
        console.error(error)
    }
}

consumerOrderedMessage().catch(console.error)