'use strict'

const { getSelectData } = require("../../utils")

const findAllDiscountCodesUnSelect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    unSelect,
    model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documnets = model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(unSelect))
        .lean()

    return documnets

}

const findAllDiscountCodesSelect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    select,
    model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documnets = model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return documnets
}

const checkDiscountExists = async ({model, filter}) => {
    return await model.findOne(filter).lean()

}

module.exports = {
    findAllDiscountCodesSelect,
    findAllDiscountCodesUnSelect,
    checkDiscountExists
}