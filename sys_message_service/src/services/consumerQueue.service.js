'use strict'

const {
    consumerQueue,
    connectToRabbitMQ
} = require('../dbs/init.rabbit')

const log = console.log

console.log = function () {
    log.apply(console, [new Date()].concat(arguments))
}

const messageService = {
    consumerQueue: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ()
            await consumerQueue(channel, queueName)
        } catch (error) {
            console.error('Error consumerToQueue::', error)
        }
    },
    consumerToQueueNormal: async () => {
        try {
            const { channel } = await connectToRabbitMQ()
            const notiQueue = 'notiQueueProcess'

            // 1.TTL
            const timeExpried = 10000
            setTimeout(() => {
                channel.consume(notiQueue, msg => {
                    console.log(`Send notification successfully::`, msg.content.toString())
                    channel.ack(msg)
                })
            }, timeExpried)


            // 2.Logic
            // channel.consume(notiQueue, msg => {
            //     try {
            //         const numberTest = Math.random()
            //         if (numberTest < 0.8) {
            //             throw new Error('Send notification failed:: Hot Fix')
            //         }
    
            //         console.log(`Send notification successfully::`, msg.content.toString())
            //         channel.ack(msg)
            //     } catch (error) {
            //         channel.nack(msg, false, false)
            //     }
            // })
        } catch (error) {
            console.error(error)
        }
    },
    consumerToQueueFailed: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ()

            const notificationExchangeDLX = 'notificationExDLX'
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'
            const notiQueueHandler = 'notiQueueHotfix'

            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                durable: true
            })

            const queueResult = await channel.assertQueue(notiQueueHandler, {
                exclusive: false
            })

            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
            await channel.consume(queueResult.queue, msgFailed => {
                console.log(`This notification error, pls hot fix::`, msgFailed.content.toString())
            }, {
                noAck: true
            })

        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

module.exports = messageService