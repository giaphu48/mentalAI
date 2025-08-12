const express = require('express');
const notifiController = require('../controllers/notificationController');
const router = express.Router();

// Lấy danh sách thông báo
router.get('/:id', notifiController.getNotificationsByUser);

// Tạo thông báo
router.post('/', notifiController.createNotification);

// Đánh dấu đã đọc
router.patch('/:notification_id/read', notifiController.markNotificationAsRead);

module.exports = router;
