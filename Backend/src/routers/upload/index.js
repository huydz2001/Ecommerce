'use strict'

const express = require('express')
const uploadController = require('../../controllers/upload.controller')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { uploadDisk, uploadMemory } = require('../../configs/multer.config')

router.post('/product', asyncHandler(uploadController.uploadImageFromUrl))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadImageThumb))
router.post('/product/multiple', uploadDisk.array('files', 3), asyncHandler(uploadController.uploadImageFromLocalFiles))

// upload s3
router.post('/product/bucket',uploadMemory.single('file'), asyncHandler(uploadController.uploadFileS3))





module.exports = router