const Meeting = require('../models/Meeting');
const { v4: uuidv4 } = require('uuid');
//const { Dropbox } = require('dropbox');
//const fs = require('fs');
//const path = require('path');
//const os = require('os');
//const axios = require('axios');
//const { transcribeAudio, generateSummary } = require('../utils/openai');

// Initialize Dropbox client
// Note: Requires process.env.DROPBOX_ACCESS_TOKEN or refresh token flow
/*const getDropboxClient = () => {
    return new Dropbox({
        clientId: process.env.DROPBOX_APP_KEY,
        clientSecret: process.env.DROPBOX_APP_SECRET,
        accessToken: process.env.DROPBOX_ACCESS_TOKEN
    });
};*/

/**
 * Create a new Jitsi meeting room
 * @route POST /api/meetings
 * @access Private
 */
exports.createMeeting = async (req, res) => {
    try {
        const roomName = `tally-${uuidv4()}`; // Generate unique room name

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
 * Save meeting recording metadata from Dropbox
 * This can be called manually or via webhook when recording is done.
 * @route POST /api/meetings/recording
 * @access Private
 */
/*
exports.saveMeetingRecording = async (req, res) => {
    try {
        const { roomName, dropboxPath } = req.body;

        if (!roomName || !dropboxPath) {
            return res.status(400).json({ message: 'roomName and dropboxPath are required' });
        }

        const meeting = await Meeting.findOne({ roomName });
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        const dbx = getDropboxClient();

        // Get file metadata
        let metadata;

        try {
            const metaResponse = await dbx.filesGetMetadata({ path: dropboxPath });
            metadata = metaResponse.result;
        } catch (dbxError) {
            console.error('Dropbox API Error:', dbxError);
            return res.status(502).json({ message: 'Failed to fetch info from Dropbox', error: dbxError });
        }

        meeting.dropboxPath = dropboxPath;
        meeting.dropboxFileId = metadata.id;
        meeting.recordingMetadata = metadata;
        meeting.status = 'completed';

        await meeting.save();

        res.json({
            success: true,
            data: meeting,
            message: 'Recording metadata saved'
        });

    } catch (error) {
        console.error('Error saving recording:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
*/
/**
 * Get recording stream/link
 * @route GET /api/meetings/:id/recording
 * @access Private
 */
/*
exports.getRecording = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting || !meeting.dropboxPath) {
            return res.status(404).json({ message: 'Recording not found' });
        }

        const dbx = getDropboxClient();

        // Refresh the temporary link as they expire (4 hours usually)
        const response = await dbx.filesGetTemporaryLink({ path: meeting.dropboxPath });

        // Return the fresh link
        res.json({
            success: true,
            url: response.result.link
        });
    } catch (error) {
        console.error('Error fetching recording:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
*/
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

/**
 * Generate AI Summary for a meeting
 * @route POST /api/meetings/:id/summary
 * @access Private
 */
/*exports.generateMeetingSummary = async (req, res) => {
    let tempFilePath = null;
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting || !meeting.dropboxPath) {
            return res.status(404).json({ message: 'Meeting or recording not found' });
        }

        // if (meeting.summary) {
        //     return res.json({ success: true, summary: meeting.summary, transcription: meeting.transcription });
        // }

        const dbx = getDropboxClient();

        // 1. Get Temporary Link
        const linkResponse = await dbx.filesGetTemporaryLink({ path: meeting.dropboxPath });
        const downloadUrl = linkResponse.result.link;

        // 2. Download File
        const tempFileName = `temp-${uuidv4()}.mp4`; // Assuming mp4, whisper handles it
        tempFilePath = path.join(os.tmpdir(), tempFileName);

        const writer = fs.createWriteStream(tempFilePath);
        const response = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'stream'
        });

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // 3. Transcribe
        console.log('Starting transcription...');
        const transcription = await transcribeAudio(tempFilePath);

        // 4. Summarize
        console.log('Starting summarization...');
        const summary = await generateSummary(transcription);

        // 5. Save to DB
        meeting.transcription = transcription;
        meeting.summary = summary;
        await meeting.save();

        // 6. Cleanup
        fs.unlinkSync(tempFilePath);

        res.json({
            success: true,
            summary,
            transcription
        });

    } catch (error) {
        console.error('Error generating summary:', error);
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
*/
