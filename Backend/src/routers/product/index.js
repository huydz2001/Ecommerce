'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authencation } = require('../../auth/authUtils')


router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.getAllProducts))
router.get('/:product_id', asyncHandler(productController.getProductById))




// authencation
router.use(authencation)

//
router.post('', asyncHandler(productController.createProduct))
router.patch('/:product_id', asyncHandler(productController.updateProduct))
router.post('/publish/:product_id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:product_id', asyncHandler(productController.unPublishProductByShop))

// Query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/publish/all', asyncHandler(productController.getAllPublishForShop))



module.exports = router