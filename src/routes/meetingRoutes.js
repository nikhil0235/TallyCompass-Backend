const express = require('express');
const router = express.Router();
const {
    createMeeting,
    saveMeetingRecording,
    getRecording,
    getMeeting,
    generateMeetingSummary
} = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createMeeting);
router.post('/recording', protect, saveMeetingRecording);
router.get('/:id/recording', protect, getRecording);
router.post('/:id/summary', protect, generateMeetingSummary);
router.get('/:id', protect, getMeeting);

module.exports = router;
