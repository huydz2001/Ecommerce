'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')
const crypto = require('crypto')

const convertToObjectIdMongoDb = id => new Types.ObjectId(id)

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

// ['a', 'b'] => {a: 1, b: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

// ['a', 'b'] => {a: 0, b: 0}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefineObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null) {
            delete obj[k]
        }
    })

    return obj
}

/* 
{
    a: {
        b: 1,
        c: 2
    }
    =>
    {
        a.b: 1,
        a.c: 2
    }
} 
*/
const updateNestedObjectParser = (obj, final = {}, prefix = '') => {
    Object.keys(obj).forEach(key => {
        const value = obj[key]
        const newKey = prefix ? `${prefix}.${key}` : key

        if (typeof value === 'object' && !Array.isArray(value)) {
            updateNestedObjectParser(value, final, newKey)
        } else if (value !== undefined && value !== null) {
            final[newKey] = value
        }
    })

    return final
}

const randomImageName = () => crypto.randomBytes(16).toString('hex')


module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefineObject,
    updateNestedObjectParser,
    convertToObjectIdMongoDb,
    randomImageName
}