'use strict'

const { NotFoundError } = require('../core/error.response')
const Comment = require('../models/comment.model')
const { getProductById } = require('../models/repositories/product.repo')
const { convertToObjectIdMongoDb } = require('../utils')

/*
    Key feat CommentService
    1- add comment [user, shop]
    2- get list comments [user,shop]
    3- delete a comment [user,shop,admin]
*/

class CommentService {
    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue
        if (parentCommentId) {
            // reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if (!parentComment) {
                throw new NotFoundError('Parent Comment Not Found')
            }
            rightValue = parentComment.comment_right

            await Comment.updateMany({
                comment_productId: convertToObjectIdMongoDb(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            await Comment.updateMany({
                comment_productId: convertToObjectIdMongoDb(productId),
                comment_left: { $gte: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })
        }
        else {
            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectIdMongoDb(productId)
            },
                'comment_right', { sort: { comment_right: - 1 } })

            if (maxRightValue) {
                rightValue = maxRightValue.right + 1
            }
            else {
                rightValue = 1
            }
        }

        // insert comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1
        await comment.save()
        return comment
    }

    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0
    }) {
        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId)
            if (!parent) {
                throw new NotFoundError('Not Found Comment For Product')
            }

            const comments = await Comment.find({
                comment_productId: convertToObjectIdMongoDb(productId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lt: parent.comment_right }
            }).select({
                comment_userId: 1,
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })

            return comments
        }

        const comments = await Comment.find({
            comment_productId: convertToObjectIdMongoDb(productId),
            comment_parentId: parentCommentId
        }).select({
            comment_userId,
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left: 1
        })

        return comments
    }

    static async delComments({
        commentId, productId
    }) {
        const foundProduct = await getProductById(productId)
        if (!foundProduct) {
            throw new NotFoundError('Product Not Found')
        }

        const comment = await Comment.findById(commentId)
        if (!comment) {
            throw new NotFoundError('Comment Not Found')
        }

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        // Cal width 
        const width = rightValue - leftValue + 1

        // Del comment child
        await Comment.deleteMany({
            comment_productId: convertToObjectIdMongoDb(productId),
            comment_left: { $gte: leftValue },
            comment_right: { $lte: rightValue }
        })

        // Update value left right difference node
        await Comment.updateMany({
            comment_productId: convertToObjectIdMongoDb(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: { comment_right: -width }
        })

        await Comment.updateMany({
            comment_productId: convertToObjectIdMongoDb(productId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: { comment_left: -width }
        })
    }
}

module.exports = CommentService