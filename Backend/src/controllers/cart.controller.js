'use strict'

const { CREATED, OK, SuccessResponse } = require("../core/success.response")
const CartService = require("../services/cart.service")


class CartController {
    addProductToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add Product To Cart Success',
            metadata: await CartService.addProductToCart({
                ...req.body
            })
        }).send(res)
    }

    getListCartUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get List Cart Success',
            metadata: await CartService.getListUserCart({
                userId: req.query.userId
            })
        }).send(res)
    }

    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Cart Success',
            metadata: await CartService.updateCart({
                ...req.body
            })
        }).send(res)
    }

    deleteItemCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Cart Success',
            metadata: await CartService.deleteItemCart({
                ...req.body
            })
        }).send(res)
    }
}

module.exports = new CartController()