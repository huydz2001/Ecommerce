'use strict'

const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo')
const { client } = require('../loggers/discord.log')
const redisClient = redis.createClient()


redisClient.ping((err, result) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Connected Redis Success');
    }
})

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)


const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2024_${productId}`
    const retryTimes = 10
    const expireTime = 3000

    for (let i = 0; index < retryTimes; i++) {
        // create key
        const result = await setnxAsync(key, expireTime)
        console.log("result::", result)
        if (result === 1) {
            // to do success
            const isReversation = await reservationInventory({
                productId, quantity, cartId
            })
            if (isReversation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }
            return null
        }
        else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}

