'use strict'

const crypto = require('crypto')

const generateKeyPair = async () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
    })

    return { privateKey, publicKey }
}

module.exports = {
    generateKeyPair
}