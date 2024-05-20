'use strict'

const cloudinary = require("../configs/cloudinary.config")
const { s3, PutObjectCommand, GetObjectCommand, DeleteBucketCommand } = require('../configs/s3.config')
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer")
const { randomImageName } = require("../utils")

// 1. upload from url image

class UploadService {
    static async uploadImageFromUrl({ path }) {
        try {
            const folderName = 'product/shopId'
            const newFileName = urlImage.substring(path.lastIndexOf('/') + 1)
            const result = await cloudinary.uploader.upload(path, {
                public_id: newFileName,
                folder: folderName
            })
            return result
        } catch (error) {
            console.error(`Error uploading images::`, error)
        }
    }

    static async uploadImageFromLocal({
        path,
        folderName = 'product/8888'
    }) {
        try {
            const result = await cloudinary.uploader.upload(path, {
                public_id: path.substring(path.lastIndexOf('.') + 1),
                folder: folderName
            })
            return {
                image_url: result.secure_url,
                shopId: 8888,
                thumb_url: await cloudinary.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: "jpg"
                })
            }
        } catch (error) {
            console.error(`Error uploading images::`, error)
        }
    }

    static async uploadImageFromLocalFiles({
        files,
        folderName = 'product/8888'
    }) {
        try {
            if (!files.length) {
                return
            }
            const uploadedUrls = []
            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: folderName
                })

                uploadedUrls.push({
                    image_url: result.secure_url,
                    shopId: 8888,
                    thumb_url: await cloudinary.url(result.public_id, {
                        height: 100,
                        width: 100,
                        format: "jpg"
                    })
                })
            }

            return uploadedUrls
        } catch (error) {
            console.error(`Error uploading images::`, error)
        }
    }


    // 
    static async uploadFileToS3(file) {
        try {
            const imageName = randomImageName()
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageName || 'unknow',
                Body: file.buffer,
                ContentType: 'image/jpeg'
            })

            // export url
            await s3.send(command)

            const signedUrl = getSignedUrl({
                url: `${urlImsgePublic}/${imageName}`,
                keyPairId,
                dateLessThan: new Date(Date.now() + 1000 * 60),
                privateKey,
            });

            return url

        } catch (error) {
            console.error(`Error uploading file::`, error)
        }
    }
}

module.exports = UploadService