'use strict'

const mongoose = require('mongoose')
const { db: { host, port, name } } = require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`
const { countConnect } = require('../helpers/check.connect')
class Database {
    constructor() {
        this.connect()
    }

    //connect
    connect(type = 'mongodb') {
        // TODO by dev env
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
        console.log(connectString)
        mongoose.connect(connectString).then(_ => {
            console.log('Connected Mongodb Success')
            // countConnect()
        })
            .catch(err => console.log("Error Connect"))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb