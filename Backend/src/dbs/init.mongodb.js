'use strict'

const mongoose = require('mongoose')
const { db: { host, port, name } } = require('../configs/mongodb.config')
const connectString = `mongodb://${host}:${port}/${name}`
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