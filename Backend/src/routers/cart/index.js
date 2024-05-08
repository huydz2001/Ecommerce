'use strict'

const express = require('express')
const cartController = require('../../controllers/cart.controller')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authencation } = require('../../auth/authUtils')


// get amout discount code
router.post('', asyncHandler(cartController.addProductToCart))
router.delete('', asyncHandler(cartController.deleteItemCart))
router.post('/update', asyncHandler(cartController.updateCart))
router.get('', asyncHandler(cartController.getListCartUser))


module.exports = router