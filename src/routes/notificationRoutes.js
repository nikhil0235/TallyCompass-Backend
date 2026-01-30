const express = require('express');
const router = express.Router();
const { getMyNotifications, createNotification, markNotificationAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');


// Create a new notification
router.post('/', protect, createNotification);

router.get('/', protect, getMyNotifications);


// Mark notification as read
router.put('/:id/read', protect, markNotificationAsRead);

module.exports = router;
