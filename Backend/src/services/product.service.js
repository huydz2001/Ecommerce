'use strict'


const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronic } = require('../models/product.model');
const { insertInventory } = require('../models/repositories/inventory.repo');
const { queryProduct, findAllDraftsForShop, findAllPublishForShop, publishProductByShop, unPublishProductByShop, searchProductByUser, findAllProducts, findProduct, updateProductById } = require('../models/repositories/product.repo');
const { removeUndefineObject, updateNestedObjectParser } = require('../utils');
const { pushNotiToSystem } = require('./notification.service');


class ProductFactory {
    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) {
            throw new BadRequestError(`Invalid Product Type ${type}`)
        }

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) {
            throw new BadRequestError(`Invalid Product Types ${type}`)
        }

        return new productClass(payload).updateProduct(productId)
    }


    // QUERY    
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProduct(
        {
            limit = 50,
            sort = 'ctime',
            page = 1,
            filter = { isPublished: true }
        }) {
        return await findAllProducts({
            limit, sort, page, filter,
            select: ['product_name', 'product_price', 'product_thumb']
        })
    }

    static async findProduct({ product_id }) {
        console.log(product_id)
        return await findProduct({ product_id, unSelect: ['__v'] })
    }

    // PUT 
    static async publicProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublicProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }
}

// Defined base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    // create product
    async createProduct(product_id) {
        const newProduct = await product.create({
            ...this,
            _id: product_id
        })

        // add product stock in inventory
        if (newProduct) {
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }

        // add system notification
        pushNotiToSystem({
            type: 'SHOP-001',
            receivedId: 1,
            senderId: this.product_shop,
            options: {
                product_name: this.product_name,
                shop_name: this.product_shop
            }
        }).then(res => console.log(res))
            .catch(console.error)

        return newProduct
    }

    // update product
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}

// Defined sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) {
            throw new BadRequestError('Create new Clothing error')
        }

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) {
            throw new BadRequestError('Create new Clothing error')
        }

        return newProduct
    }

    async updateProduct(productId) {
        // remove attr undefined or null
        const objectParams = removeUndefineObject(this)

        // check place update
        if (objectParams.product_attributes) {
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
                model: clothing
            })
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

// Defined sub-class for different product types Electronics
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) {
            throw new BadRequestError('Create new Clothing error')
        }

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) {
            throw new BadRequestError('Create new Clothing error')
        }

        return newProduct
    }

    async updateProduct(productId) {
        // remove attr undefined or null
        const objectParams = removeUndefineObject(this)

        // check place update
        if (objectParams.product_attributes) {
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
                model: electronic
            })
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

// register Product types
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)


module.exports = ProductFactory

