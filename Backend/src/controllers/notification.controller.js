'use strict'

const { CREATED, OK, SuccessResponse } = require("../core/success.response")
const NotificationService = require("../services/notification.service")


class NotificationController {
    listNotiByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get List Notification Success',
            metadata: await NotificationService.listNotiByUser(req.body)
        }).send(res)
    }
 
}

module.exports = new NotificationController()