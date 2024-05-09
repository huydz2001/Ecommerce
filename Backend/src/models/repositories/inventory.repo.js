'use strict'

const { convertToObjectIdMongoDb } = require("../../utils")
const inventory = require("../inventory.model")


const insertInventory = async ({
    productId,
    shopId,
    stock,
    location = 'unknow'
}) => {
    return inventory.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_location: location,
        inven_stock: stock
    })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        iven_productId: convertToObjectIdMongoDb(productId),
        iven_stock: { $gte: quantity }
    },
        udpateSet = {
            $inc: {
                iven_stock: -quantity
            },
            $push: {
                iven_reservation: {
                    quantity,
                    cartId,
                    crateAt: new Date()
                }
            }
        }, options = { upsert: true, new: true }

    return await inventory.updateOne(query, udpateSet)

}

module.exports = {
    insertInventory,
    reservationInventory
}