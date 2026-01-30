const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'active', 'completed'],
        default: 'scheduled'
    },
    dropboxFileId: {
        type: String, // ID from Dropbox API
    },
    dropboxPath: {
        type: String, // Path in Dropbox
    },
    recordingMetadata: {
        type: Object // Store full metadata from Dropbox
    },
    transcription: {
        type: String // Full transcript from Whisper
    },
    summary: {
        type: String // AI Summary
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Meeting', meetingSchema);
