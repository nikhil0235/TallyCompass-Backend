// Routes for image/media upload, retrieval, and deletion
const express = require('express');
const router = express.Router();
const { upload } = require('../models/Media');
const { uploadImage, getAllMedia, deleteMedia } = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Media routes working' });
});

// Upload media (image/video) - Protected
router.post('/upload', protect, (req, res, next) => {
    upload.single('media')(req, res, (err) => {
        if (err) {
            console.error('Multer/Cloudinary error:', err);
            return res.status(500).json({ error: err.message });
        }
        next();
    });
}, uploadImage);

// Get all media - Protected
router.get('/media', protect, getAllMedia);

// Delete media - Protected
router.delete('/media/:id', protect, deleteMedia);

module.exports = router;
