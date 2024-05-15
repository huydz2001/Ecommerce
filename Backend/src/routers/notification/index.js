'use strict'

const express = require('express')
const notificationController = require('../../controllers/notification.controller')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authencation } = require('../../auth/authUtils')




router.use(authencation)
router.get('', asyncHandler(notificationController.listNotiByUser))


module.exports = router