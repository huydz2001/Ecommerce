'use strict'

const { createTokenPair } = require("../auth/authUtils")
const { BadRequestError, AuthFailureError } = require("../core/error.response")
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
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKey(keyStore._id)
        return delKey
    }

}

module.exports = AccessService