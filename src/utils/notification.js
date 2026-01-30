const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('./sendEmail');

/**
 * Parses description for @mentions and sends emails to mentioned users.
 * Also creates Notification records in DB.
 * @param {string} description - The text content to parse.
 * @param {string} source - The source context (e.g., 'VOC', 'Feedback').
 * @param {string} id - The ID of the item created/updated.
 * @param {string} fromUserId - The ID of the user performing the action.
 */
const checkAndSendMentions = async (description, source, id, fromUserId) => {
    if (!description) return;

    // Regex to find @username
    const mentionRegex = /@(\w+)/g;
    const mentions = [...new Set(description.match(mentionRegex) || [])]; // Get unique mentions

    if (mentions.length === 0) return;

    // Extract usernames without '@'
    const usernames = mentions.map(mention => mention.substring(1));

    try {
        // Find users matching the usernames
        const users = await User.find({ userName: { $in: usernames } });

        if (users.length === 0) return;

        // Create Notifications and Send Emails
        const actions = users.map(async (user) => {
            // Create in-app notification
            await Notification.create({
                description: `You were mentioned in a ${source}`,
                toUser: user._id,
                fromUser: fromUserId,
                resourceId: id,
                resourceModel: source
            });

            // Send Email
            const message = `
                <h1>You were mentioned in a ${source}!</h1>
                <p>Hello ${user.userName},</p>
                <p>You were mentioned in the description of a ${source} (ID: ${id}).</p>
                <p><strong>Description Snippet:</strong></p>
                <blockquote>${description}</blockquote>
                <p>Please check the application for more details.</p>
            `;

            return sendEmail({
                email: user.email,
                subject: `You were mentioned in a ${source}`,
                message
            });
        });

        await Promise.all(actions);
        console.log(`Sent notification emails and saved DB records for ${users.length} users.`);

    } catch (error) {
        console.error('Error sending mention notifications:', error);
    }
};

module.exports = { checkAndSendMentions };
