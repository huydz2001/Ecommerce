'use strict'

const { createTokenPair } = require("../auth/authUtils")
const shopModel = require("../models/shop.model")
const { getInfoData } = require("../utils")
const KeyTokenService = require("./keyToken.service")
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const RoleShop = {
    SHOP: '00000',
    WRITTER: '00001',
    EDITOR: '00002',
    ADMIN: '99999'
}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        try {
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                return {
                    code: 'xxx',
                    message: "Shop already register!"
                }
            }

            const passwordhash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordhash, roles: [RoleShop.SHOP]
            })

            if (newShop) {
                // create priavteKey, publicKey
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

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })

                if (!publicKeyString) {
                    return {
                        code: 'xxx',
                        message: "publicKeyString error"
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString)

                // create token pair
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyString, privateKey)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
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

}

module.exports = AccessService