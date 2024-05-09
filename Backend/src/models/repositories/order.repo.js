'use strict'

const { getSelectData } = require("../../utils")
const order = require("../order.model")

const getOrderByUser = async ({ userId, select }) => {
    const orders = order.findOne({
        order_userId: userId
    })
        .select(getSelectData(select))
        .lean()

    return orders

}


module.exports = {
    getOrderByUser
}