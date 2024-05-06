'use strict'

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}


const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, BadRequestError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')


const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access Token
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        // refresh Token
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('error vertiff::', err)
            }
            console.log('decode vertify::', decode)
        })

        return { accessToken, refreshToken }
    }
    catch (error) {

    }
}

const authencation = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) {
        throw new AuthFailureError('Invalid request')
    }

    const keyStore = await findByUserId(userId)
    if (!keyStore) {
        throw new NotFoundError('Not found keyStore')
    }

    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.publicKey)
            if (userId != decodeUser.userId) {
                throw new AuthFailureError('Invalid userId')
            }
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        }
        catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new AuthFailureError('Invalid request')
    }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId != decodeUser.userId) {
            throw new AuthFailureError('Invalid userId')
        }
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    }
    catch (error) {
        throw error
    }

})

const vertifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}


module.exports = {
    createTokenPair,
    authencation,
    vertifyJWT
}