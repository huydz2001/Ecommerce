'use strict'

const { CREATED, OK, SuccessResponse } = require("../core/success.response")
const DiscountService = require("../services/discount.service")


class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Discount Code Success',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all Discount Code Success',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query
            })
        }).send(res)
    }

    getALLDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all Discount Code Success',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    getALLDiscountCodesWithProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all Discount Code Success',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query
            })
        }).send(res)
    }
}

module.exports = new DiscountController()