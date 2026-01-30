const Notification = require('../models/Notification');

/**
 * Get all notifications for the logged-in user
 * @route GET /api/notifications
 * @access Private
 */
exports.getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ toUser: req.user._id })
            .sort({ createdAt: -1 })
            .populate('fromUser', 'userName profilePicture') // Populate sender details
            .populate('toUser', 'userName');

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
