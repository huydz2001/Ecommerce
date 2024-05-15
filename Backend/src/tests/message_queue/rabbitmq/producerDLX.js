const amqp = require('amqplib')
const messages = 'Alo 1234 test '

const log = console.log

console.log = function (){
    log.apply(console, [new Date()].concat(arguments))
}

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://admin:123456@localhost')
        const channel = await connection.createChannel()

        // NotificationEx direct
        const notificationExchange = 'notificationEx'
        // assertQueue
        const notiQueue = 'notiQueueProcess'
        // notificationEx direct
        const notificationExchangeDLX = 'notificationExDLX'
        // notification router
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'

        // 1.create Exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })

        // 2.create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })

        // 3. bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange)

        // 4. send message
        const message = 'A new product'
        await channel.sendToQueue(queueResult.queue, Buffer.from(message), {
            expiration: '3000'
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    }
    catch (error) {
        console.error('Error:', error)
    }
}

runProducer().then(rs => console.log(rs)).catch(console.error)