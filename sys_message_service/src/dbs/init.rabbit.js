'use strict'

const amqp = require('amqplib')

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://admin:123456@localhost')
        if (!connection) {
            throw new Error('Connection invalid')
        }

        const channel = await connection.createChannel()
        return { channel, connection }
    } catch (error) {
        console.error('Error connection to RabbitMQ', error)
        throw error
    }
}

const connectToRabbitMQForTest = async () => {
    try {
        const { channel, connection } = await connectToRabbitMQ()

        // Publish  message to a queue
        const queue = 'test-queue'
        const message = 'Hello world!'
        await channel.assertQueue(queue)
        await channel.sendToQueue(queue, Buffer.from(message))

        // Close the connection
        await connection.lose()
    } catch (error) {
        console.error('Error connection to RabbitMQ', error)
    }
}

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, { durable: true })
        console.log('Wating for message....')
        channel.consume(queueName, msg => {
            console.log(`Recevied message: ${queueName}::`, msg.content.toString())
        }, {
            noAck: true
        })
    } catch (error) {
        console.error('Error publish to rabbitMQ:', error)
        throw error
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
}