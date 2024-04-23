'use strict'

const { findById } = require('../services/apikey.service')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    console.log(req.headers)
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                message: 'Forbidan Error'
            })
        }

        // check objKey
        const objKey = await findById(key)
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidan Error'
            })
        }

        req.objKey = objKey
        return next()
    }
    catch (error) {

    }
}

const permission = (permission) => {
    console.log(permission)
    return (req, res, next) => {
        console.log('permission::',req.objKey.permissions)
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'permission dinied'
            })
        }

        const validPermission = req.objKey.permissions.includes(permission)
        if (!validPermission) {
            return res.status(403).json({
                message: 'permission dinied'
            })
        }

        return next()
    }
}


module.exports = {
    apiKey,
    permission
}