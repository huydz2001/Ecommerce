'use strict'

const { CREATED, OK, SuccessResponse } = require("../core/success.response")
const InventoryService = require("../services/inventory.service")


class CheckoutController {
    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add Stock To Inventory Success',
            metadata: await InventoryService.addStockToInventory({
                ...req.body
            })
        }).send(res)
    }

    
}

module.exports = new CheckoutController()