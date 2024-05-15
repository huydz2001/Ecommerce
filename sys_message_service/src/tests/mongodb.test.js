'use strict'

const mongose = require('mongoose')
const connectString = 'mongodb://localhost:27017/Ecommerce'

const TestSchema = new mongose.Schema({ name: String })
const Test = mongose.model('Test', TestSchema)

describe('Mongose Connection', () => {
    let connection

    beforeAll(async () => {
        connection = await mongose.connect(connectString)
    })

    afterAll(async () => {
        await connection.disconnect()
    })

    it('Should connect to mongose', () => {
        expect(mongose.connection.readyState).toBe(1)
    })

    it('Should save a document to the database', async () => {
        const user = new Test({ name: 'Huy' })
        await user.save()
        expect(user.isNew).toBe(false)
    })

    it('Should find a document to the database', async () => {
        const user = await Test.findOne({ name: 'Huy' })
        expect(user.name).toBe('Huy')
    })
})