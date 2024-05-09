'use strict'

const express = require('express')
const inventoryController = require('../../controllers/inventory.controller')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authencation } = require('../../auth/authUtils')


// authencation
router.use(authencation)
router.post('', asyncHandler(inventoryController.addStockToInventory))



module.exports = router