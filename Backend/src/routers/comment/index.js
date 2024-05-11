'use strict'

const express = require('express')
const commentController = require('../../controllers/comment.controller')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authencation } = require('../../auth/authUtils')


router.use(authencation)
router.post('', asyncHandler(commentController.createComment))
router.get('', asyncHandler(commentController.getCommentsByParentId))
router.delete('', asyncHandler(commentController.deleteCommentsById))


module.exports = router