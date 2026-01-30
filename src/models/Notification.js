const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'mention', // Can be expanded later e.g., 'system', 'assigned'
    },
    description: {
        type: String,
        required: true,
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    resourceModel: {
        type: String,
        required: true,
        enum: ['VOC', 'Feedback', 'CustomerRequest'],
    },
    isRead: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);
