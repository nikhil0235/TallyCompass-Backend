
import Meeting from "../models/Meeting.js";



/**
 * Create a new Jitsi meeting room
 * @route POST /api/meetings
 * @access Private
 */
export const createMeeting = async (req, res) => {
    try {
        const roomName = `tally-${"hello"}`; // Generate unique room name

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
 * Get recording stream/link
 * @route GET /api/meetings/:id/recording
 * @access Private

/**
 * Get meeting details
 * @route GET /api/meetings/:id
 * @access Private
 */
export const getMeeting = async (req, res) => {
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

