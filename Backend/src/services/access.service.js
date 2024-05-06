'use strict'

const { createTokenPair, vertifyJWT } = require("../auth/authUtils")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const shopModel = require("../models/shop.model")
const { getInfoData } = require("../utils")
const KeyTokenService = require("./keyToken.service")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { findByEmail } = require("./shop.service")
const { generateKeyPair } = require("../utils/generateKey")

const RoleShop = {
    SHOP: '00000',
    WRITTER: '00001',
    EDITOR: '00002',
    ADMIN: '99999'
}

class AccessService {
    static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
        const {userId, email} = user

        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend !! Pls relogin')
        }

        if(keyStore.refreshToken !== refreshToken){
            throw new AuthFailureError('Shop not registed')
        }

        // vertify token
        const foundShop = await findByEmail({ email })
        if (!foundShop) {
            throw new AuthFailureError('Shop not registed')
        }

        // create new token
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, holderToken.privateKey)

        // update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user,
            tokens
        }
    }

    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email })
        if (!foundShop) {
            throw new BadRequestError('Shop not registed!')
        }

        const match = bcrypt.compare(password, foundShop.password)
        if (!match) {
            throw new AuthFailureError('Authencation error')
        }

        // create priavteKey, publicKey
        const { privateKey, publicKey } = await generateKeyPair()

        // create token pair
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            refreshToken: tokens.refreshToken,
            privateKey: privateKey,
            publicKey: publicKey
        })

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        try {
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                throw new BadRequestError('Error: Shop already registed!')
            }

            const passwordhash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordhash, roles: [RoleShop.SHOP]
            })

            if (newShop) {
                // create priavteKey, publicKey
                const { privateKey, publicKey } = await generateKeyPair()

                // create token pair
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

                await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    refreshToken: tokens.refreshToken,
                    privateKey: privateKey,
                    publicKey: publicKey
                })

                return {
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }

            }
            return {
                code: 200,
                metadata: null
            }
        }
        catch (error) {
            throw new BadRequestError(error.message)
        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKey(keyStore._id)
        return delKey
    }

}

module.exports = AccessService