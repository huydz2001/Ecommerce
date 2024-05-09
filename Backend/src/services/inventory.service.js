'use strict'

const { BadRequestError } = require("../core/error.response")
const inventory = require("../models/inventory.model")
const { getProductById } = require("../models/repositories/product.repo")

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = '144 quan nhan'
    }) {
        const product = await getProductById(productId)
        if (!product) {
            throw new BadRequestError('The product does not exits!')
        }

        const query = { iven_shopId: shopId, iven_productId: productId },
            updateSet = {
                $inc: {
                    iven_stock: stock
                },
                $set: {
                    iven_location: location
                }
            },
            options = { upsert: true, new: true }

        return await inventory.findOneAndUpdate(query, updateSet)
    }
}

module.exports = InventoryService