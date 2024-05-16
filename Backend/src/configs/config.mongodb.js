'use strict'

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3052
    },
    db: {
        host: process.env.DEV_MONGODB_HOST || '127.0.0.1',
        port: process.env.DEV_MONGODB_PORT || 27017,
        name: process.env.DEV_MONGODB_NAME || 'EcommerceDev'
    }
}

const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3000
    },
    db: {
        host: process.env.PRO_MONGODB_HOST || '127.0.0.1',
        port: process.env.PRO_MONGODB_PORT || 27017,
        name: process.env.PRO_MONGODB_NAME || 'EcommercePro'
    }
}
const config = { dev, pro }
const env = process.env.NODE_DEV

module.exports = config[env]