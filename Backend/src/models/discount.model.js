'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'


// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name: {
        type: String,
        required: true
    },
    discount_desc: {
        type: String,
        required: true
    },
    discount_type: {
        type: String,
        default: 'fixed_amount'
    },
    discount_value: {
        type: Number,
        required: true
    },
    discount_max_value: {
        type: Number,
        required: true
    },
    discount_code: {
        type: String,
        required: true
    },
    discount_start_date: {
        type: Date,
        required: true
    },
    discount_end_date: {
        type: Date,
        required: true
    },
    discount_amout: {
        type: Number,
        required: true
    },
    // number max discount used
    discount_uses_count: {
        type: Number,
        required: true
    },
    discount_users_used: {
        type: Array,
        required: true
    },
    discount_max_uses_per_user: {
        type: Number,
        required: true
    },
    discount_min_order_value: {
        type: Number,
        required: true
    },
    discount_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    discount_is_active: {
        type: Boolean,
        default: true
    },
    discount_applies_to: {
        type: String,
        enum: ['all', 'specific'],
        required: true
    },
    discount_product_ids: {
        type: Array,
        default: []
    }

}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);