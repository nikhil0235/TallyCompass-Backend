/**
 * Create a new notification
 * @route POST /api/notifications
 * @access Private
 */
const { getSocketIO } = require('../socket');

exports.createNotification = async (req, res) => {
    try {
        const { type, description, toUser, fromUser, resourceId, resourceModel } = req.body;
        if (!description || !toUser || !resourceId || !resourceModel) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const notification = new Notification({
            type,
            description,
            toUser,
            fromUser: fromUser || req.user?._id,
            resourceId,
            resourceModel
        });
        await notification.save();

        // Emit real-time event only to the specific user
        try {
            const io = getSocketIO();
            if (toUser) {
                io.to(toUser.toString()).emit('new-notification', notification);
                console.log(`Emitted new-notification to user ${toUser}`);
            }
        } catch (e) {
            console.error('Socket.IO emit error:', e);
        }

        res.status(201).json(notification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
const Notification = require('../models/Notification');

/**
 * Get all notifications for the logged-in user
 * @route GET /api/notifications
 * @access Private
 */
exports.getMyNotifications = async (req, res) => {
    try {
        // Fetch all notifications (read and unread)
        const notifications = await Notification.find({ toUser: req.user._id })
            .sort({ createdAt: -1 })
            .populate('fromUser', 'userName profilePicture')
            .populate('toUser', 'userName');
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * Mark a notification as read
 * @route PUT /api/notifications/:id/read
 * @access Private
 */
exports.markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id, toUser: req.user._id });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        notification.isRead = true;
        await notification.save();
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
