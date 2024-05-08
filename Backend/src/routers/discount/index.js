'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authencation } = require('../../auth/authUtils')


// get amout discount code
router.post('/amount', asyncHandler(discountController.getALLDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getALLDiscountCodesWithProducts))


// authencation
router.use(authencation)

//
router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodes))




module.exports = router