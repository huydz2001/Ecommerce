'use strict'

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteBucketCommand } = require('@aws-sdk/client-s3')
const { AWS_REGION, AWS_BUCKET_NAME, AWS_BUCKET_SCRETKEY, AWS_BUCKET_ACCESSKEY } = process.env

const s3config = {
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_BUCKET_ACCESSKEY,
        secretAccessKey: AWS_BUCKET_SCRETKEY
    }
}
const s3 = new S3Client(s3config)
module.exports = {
    s3,
    PutObjectCommand,
    GetObjectCommand,
    DeleteBucketCommand
}
