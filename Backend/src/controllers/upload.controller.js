'use strict'

const { BadRequestError } = require("../core/error.response")
const { CREATED, OK, SuccessResponse } = require("../core/success.response")
const UploadService = require("../services/upload.service")


class UploadController {
    uploadImageFromUrl = async (req, res, next) => {
        new SuccessResponse({
            message: 'Upload Image Success',
            metadata: await UploadService.uploadImageFromUrl({
                path: req.imageUrl
            })
        }).send(res)
    }

    uploadImageThumb = async (req, res, next) => {
        const { file } = req
        if (!file) {
            throw new BadRequestError('File missing')
        }
        new SuccessResponse({
            message: 'Upload Image Success',
            metadata: await UploadService.uploadImageFromLocal({
                path: file.path
            })
        }).send(res)
    }

    uploadImageFromLocalFiles = async (req, res, next) => {
        const { files } = req
        if (!files.length) {
            throw new BadRequestError('File missing')
        }
        new SuccessResponse({
            message: 'Upload Image Success',
            metadata: await UploadService.uploadImageFromLocalFiles({
                files
            })
        }).send(res)
    }

    uploadFileS3 = async (req, res, next) => {
        const { file } = req
        if (!file) {
            throw new BadRequestError('File missing')
        }
        new SuccessResponse({
            message: 'Upload File Success',
            metadata: await UploadService.uploadFileToS3(file)
        }).send(res)
    }
}

module.exports = new UploadController()