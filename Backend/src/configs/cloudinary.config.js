'use strict'

// Require the cloudinary library
const cloudinary = require('cloudinary').v2
const { CLOUDINARY_API_SCERET, CLOUDINARY_API_KEY, CLOUDINARY_NAME } = process.env

// Return "https" URLs by setting secure: true
cloudinary.config({
    secure: true,
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SCERET
})

module.exports = cloudinary