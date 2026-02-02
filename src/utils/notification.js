const User = require('../models/User');
const Notification = require('../models/Notification');
const { getSocketIO } = require('../socket');
const sendEmail = require('./sendEmail');

const sendNotifications = async (description, source, id, fromUserId, additionalRecipients = []) => {
    // Regex to find @username
    const mentionRegex = /@(\w+)/g;
    const mentions = description ? [...new Set(description.match(mentionRegex) || [])] : []; // Get unique mentions

    // Extract usernames without '@'
    const usernames = mentions.map(mention => mention.substring(1));

    let targetUserIds = new Set(additionalRecipients.map(id => id.toString()));

    try {
        // Find users matching the usernames
        if (usernames.length > 0) {
            const usersFromMentions = await User.find({ userName: { $in: usernames } });
            usersFromMentions.forEach(user => targetUserIds.add(user._id.toString()));
        }

        if (targetUserIds.size === 0) return;

        const allUserIds = Array.from(targetUserIds);
        const usersToNotify = await User.find({ _id: { $in: allUserIds } });

        if (usersToNotify.length === 0) return;

        // Create Notifications and Send Emails
        const actions = usersToNotify.map(async (user) => {
            // Avoid notifying the sender themselves if they are in the list (optional, but good practice)
            if (user._id.toString() === fromUserId.toString()) return;

            // Create in-app notification
            const notification = await Notification.create({
                description: `You were mentioned/added in a ${source}`, // Generic message, can be refined based on context
                toUser: user._id,
                fromUser: fromUserId,
                resourceId: id,
                resourceModel: source
            });

            // Emit real-time event via Socket.IO
            try {
                const io = getSocketIO();
                if (io) {
                    io.to(user._id.toString()).emit('new-notification', notification);
                    console.log(`Emitted real-time notification to user ${user._id}`);
                }
            } catch (socketError) {
                console.error('Socket.IO emit error in sendNotifications:', socketError);
            }

            // Send Email
            const message = `
                <h1>New Notification from ${source}</h1>
                <p>Hello ${user.userName},</p>
                <p>You have a new notification regarding a ${source} (ID: ${id}).</p>
                ${description ? `
                <p><strong>Description Snippet:</strong></p>
                <blockquote>${description}</blockquote>` : ''}
                <p>Please check the application for more details.</p>
            `;

            return sendEmail({
                email: user.email,
                subject: `Notification from ${source}`,
                message
            });
        });

        await Promise.all(actions);
        console.log(`Sent notification emails and saved DB records for ${usersToNotify.length} users.`);

    } catch (error) {
        console.error('Error sending notifications:', error);
    }
};

module.exports = { sendNotifications, checkAndSendMentions: sendNotifications };
