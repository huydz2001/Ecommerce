'use strict'

const cart = require("../models/cart.model")
const { NotFoundError } = require('../core/error.response')
const { createUserCart, updateUserCartQuantity, deleteUserCart, checkExistProductInCart } = require("../models/repositories/cart.repo")
const { getProductById } = require("../models/repositories/product.repo")

/*
    Cart Service
    1- add product to cart [user]
    2- reduce product quatity by one [user]
    3- increse product quantity by one [user]
    4- get cart [user]
    5- delete cart [user]
    6- delete cart item [user]
*/

class CartService {
    static async addProductToCart({ userId, product = {} }) {
        // check cart exits
        const userCart = await cart.findOne({
            cart_userId: userId
        })

        if (!userCart) {
            // create cart user
            return createUserCart({ userId, product })
        }

        // Case cart empty
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // check product 
        const exitsProduct = await checkExistProductInCart({ userId, product })
        if (exitsProduct) {
            return await updateUserCartQuantity({ userId, product })
        }
        else {
            return await createUserCart({ userId, product })
        }

    }

    // udpate cart
    /*
    shop_order_ids : [
        {
            shopId,
            item_products: [
                {
                    quantity,
                    price,
                    shopId,
                    old_quantity,
                    productId
                }
            ],
            version
        }
    ]
    */
    static async updateCart({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

        // check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) {
            throw new NotFoundError('Invalid Product')
        }

        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to shop')
        }

        if (quantity === 0) {
            return await deleteUserCart({ userId, productId })
        }

        return await updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteItemCart({ userId, productId }) {
        const deleted = await deleteUserCart({ userId, productId })
        return deleted
    }


    static async getListUserCart({ userId }) {
        return await cart.findOne({
            cart_userId: userId
        }).lean()
    }

}

module.exports = CartService