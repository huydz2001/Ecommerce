'use strict'


const mongoose = require('mongoose')
const slugify = require('slugify')
const { model, Schema } = mongoose
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_description: String,
    product_slug: String,
    product_price: {
        type: Number,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        require: true
    },
    product_ratingsAverage: {
        type: Schema.Types.Number,
        default: 5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// create index for search
productSchema.index({product_name: 'text', product_description: 'text'})

// Documnent middleware
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

// define the product type = clothing
const clothingSchema = new Schema({
    brand: { type: String, require: true },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    size: String,
    material: String
}, {
    collection: 'Clothes',
    timestamps: true
})

// define the product type = electronics
const electronicSchema = new Schema({
    brand: { type: String, require: true },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    model: String,
    color: String
}, {
    collection: 'Electronics',
    timestamps: true
})

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Electronics', clothingSchema),
    electronic: model('Clothing', electronicSchema)

}
