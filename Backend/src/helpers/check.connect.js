'use strict'

const mongoose = require('mongoose')
const os = require('os')
const _SECONDS = 5000

// count Conenct
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections::${numConnection}`)
}

// check over load
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        // Excample maximum number of connections based on number cores
        const maxConnections = numCores * 5

        if (numConnection > maxConnections) {
            console.log('Connection overload deteced!')
            // handle over load
        }

    }, _SECONDS) // Moniter every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
}
