'use strict'

const {
    connectToRabbitMQForTest
} = require('../dbs/init.rabbit')

describe('RabbitMQ Connect', () => {
    it('Should connect to successful RabbitMQ', async () => {
        const result = await connectToRabbitMQForTest()
        expect(result).toBeUndefined()
    })
})