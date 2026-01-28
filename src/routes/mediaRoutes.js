// Routes for image/media upload, retrieval, and deletion
const express = require('express');
const router = express.Router();
const { upload } = require('../modules/Media');
const { uploadImage, getAllMedia, deleteMedia } = require('../controllers/mediaController');

// Upload media (image/video)
router.post('/upload', upload.single('media'), uploadImage);

// Get all media
router.get('/media', getAllMedia);

// Delete media
router.delete('/media/:id', deleteMedia);

module.exports = router;
