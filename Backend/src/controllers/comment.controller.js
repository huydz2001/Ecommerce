'use strict'

const { CREATED, OK, SuccessResponse } = require("../core/success.response")
const CommentService = require("../services/comment.service")


class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Comment Success',
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get List Comment Success',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res)
    }

    deleteCommentsById= async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Comment Success',
            metadata: await CommentService.delComments(req.body)
        }).send(res)
    }

    
}

module.exports = new CommentController()