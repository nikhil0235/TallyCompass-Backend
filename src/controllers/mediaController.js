// Controller for image/media upload, retrieval, and deletion
const { Media, cloudinary } = require('../modules/Media');

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const media = new Media({
            title: req.body.title,
            imageUrl: req.file.path,
            publicId: req.file.filename || req.file.public_id,
            resourceType: req.file.mimetype && req.file.mimetype.startsWith('video') ? 'video' : 'image',
        });
        await media.save();
        res.json({ message: 'Uploaded!', data: media });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllMedia = async (req, res) => {
    try {
        const items = await Media.find().sort({ uploadedAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteMedia = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) return res.status(404).json({ msg: 'Not found' });
        await cloudinary.uploader.destroy(media.publicId, {
            resource_type: media.resourceType,
        });
        await media.deleteOne();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { uploadImage, getAllMedia, deleteMedia };
