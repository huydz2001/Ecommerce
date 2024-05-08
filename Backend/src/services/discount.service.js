'use strict'

const { find, some, filter } = require("lodash")
const { BadRequestError, NotFoundError } = require("../core/error.response")
const discount = require("../models/discount.model")
const { convertToObjectIdMongoDb } = require("../utils")
const { findAllProducts } = require("../models/repositories/product.repo")
const { findAllDiscountCodesSelect, findAllDiscountCodesUnSelect, checkDiscountExists } = require("../models/repositories/discount.repo")
const { product } = require("../models/product.model")

/*
    Discount Service
    1- Generator discount code [shop/admin]
    2- Get discount amount [user]
    3- Get all discount code [user/shop]
    4- Vertify discount code [user]
    5- Delete discount code [admin/shop]
    6- Cancel discount code [user]
*/

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active, shopId,
            min_order_value, product_ids, applies_to, users_used,
            max_uses_per_user, name, desc, type, max_value, amount, uses_count, value
        } = payload

        if (new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expried')
        }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end date')
        }

        // crate index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoDb(shopId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount code has exists!')
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_desc: desc,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_amout: amount,
            discount_uses_count: uses_count,
            discount_uses_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount
    }

    static async updatedDiscountCode() {

    }

    static async getAllDiscountCodeWithProduct({
        code, shopId, userId, limit, page
    }) {
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoDb(shopId)
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount not exists')
        }

        let products
        const { discount_applies_to, discount_product_ids } = foundDiscount
        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongoDb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products
    }

    static async getAllDiscountCodesByShop({
        limit,
        page,
        shopId
    }) {
        const discounts = await findAllDiscountCodesSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongoDb(shopId),
                discount_is_active: true
            },
            select: ['discount_code','discount_name','discount_shopId'],
            model: discount
        })

        return discounts
    }

    static async getDiscountAmount({
        codeId,
        userId,
        shopId,
        products
    }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongoDb(shopId)
            }
        })

        if (!foundDiscount) {
            throw new NotFoundError(`Discount doesn't exists!`)
        }

        const {
            discount_is_active,
            discount_amout,
            discount_min_order_value,
            discount_amount,
            discount_max_per_user,
            discount_start_date,
            discount_end_date,
            discount_type,
            discount_value
        } = foundDiscount

        if (!discount_is_active) {
            throw new NotFoundError(`Discount expried!`)
        }
        if (!discount_amout) {
            throw new NotFoundError('Discount are out')
        }
        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundError('Discount code is expried!')
        }

        let totalOrder = 0
        if (discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`Discount requires a minium order value of ${discount_min_order_value}`)
            }
        }

        if (discount_max_per_user > 0) {
            const userUserDiscount = discount_amount.find(user => user.userId == userId)
            if (userUserDiscount) {

            }
        }

        console.log("ddd:::", discount_type)
        const amount = discount_type === 'fixed_amout' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }

    }

    static async deleteDiscountCode({ shopId, codeId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongoDb(shopId)
        })

        return deleted
    }

    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongoDb(shopId)
            }
        })

        if (!foundDiscount) {
            throw new NotFoundError('Discount not exists')
        }

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_uses_used: userId
            },
            $inc: {
                discount_amout: 1,
                discount_uses_count: -1
            }
        })

        return result
    }

}

module.exports = DiscountService