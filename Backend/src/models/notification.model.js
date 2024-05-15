'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'


// Declare the Schema of the Mongo model
var notificationSchema = new Schema({
    noti_type: {
        type: String,
        required: true
    },
    noti_senderId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    noti_receivedId: {
        type: Number,
        ref: 'Shop',
        required: true
    },
    noti_content: {
        type: String,
        required: true
    },
    noti_options: {
        type: Object,
        default: {}
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema);