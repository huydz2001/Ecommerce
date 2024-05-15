'use strict'

const redisPubsubService = require("../services/redisPubsub.service")

class InventoryServiceTest {
    constructor() {
        redisPubsubService.subscribe('purchase_events', (channel, message) => {
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(message) {
        const productId = message.productId;
        const quantity = message.quantity;
        console.log(`Product:: ${productId}, quantity:: ${quantity}`)
    }
}

module.exports = new InventoryServiceTest()