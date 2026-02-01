const Meeting = require('../models/Meeting');
const crypto = require('crypto');

/**
 * Create a new Jitsi meeting room
 * @route POST /api/meetings
 * @access Private
 */
exports.createMeeting = async (req, res) => {
    try {
        // Generate unique room name using random hex string
        const randomSuffix = crypto.randomBytes(4).toString('hex');
        const roomName = `tally-meet-${randomSuffix}`;

        const meeting = await Meeting.create({
            roomName,
            createdBy: req.user._id,
            status: 'scheduled'
        });

        res.status(201).json({
            success: true,
            data: meeting,
            message: 'Meeting room created'
        });
    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get meeting details
 * @route GET /api/meetings/:id
 * @access Private
 */
exports.getMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id)
            .populate('createdBy', 'userName email');

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.json({ success: true, data: meeting });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
