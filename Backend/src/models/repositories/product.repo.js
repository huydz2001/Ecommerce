'use strict'

const { default: mongoose } = require('mongoose')
const { product, electronic, clothing } = require('../product.model')
const { getSelectData, unGetSelectData, convertToObjectIdMongoDb } = require('../../utils')

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_shop', 'name, email _id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new mongoose.Types.ObjectId(product_shop),
        _id: new mongoose.Types.ObjectId(product_id)
    })

    if (!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true

    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new mongoose.Types.ObjectId(product_shop),
        _id: new mongoose.Types.ObjectId(product_id)
    })

    if (!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false

    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublished: true,
        $text: { $search: regexSearch }
    }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .lean()

    return results
}

const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id)
        .select(unGetSelectData(unSelect))
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return products
}

const updateProductById = async ({
    productId,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    })
}

const getProductById = async (productId) => {
    return await product.findOne({
        _id: convertToObjectIdMongoDb(productId)
    }).lean()
}


module.exports = {
    publishProductByShop,
    findAllDraftsForShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById
}