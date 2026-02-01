// Controller for image/media upload, retrieval, and deletion
const { Media, cloudinary } = require('../models/Media');

const uploadImage = async (req, res) => {
    try {
        console.log('Upload request received');
        console.log('req.file keys:', Object.keys(req.file || {}));
        console.log('req.file:', req.file);
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        
        // multer-storage-cloudinary provides URL in different properties
        let fileUrl = req.file.secure_url || req.file.url || req.file.path;
        
        // If still no URL, construct it from Cloudinary
        if (!fileUrl && req.file.public_id) {
            fileUrl = cloudinary.url(req.file.public_id, {
                secure: true,
                resource_type: req.file.resource_type || 'auto'
            });
        }
        
        console.log('Final file URL:', fileUrl);
        
        if (!fileUrl || fileUrl.startsWith('blob:')) {
            console.error('Invalid URL:', fileUrl);
            return res.status(500).json({ error: 'Failed to get valid file URL from Cloudinary' });
        }
        
        const media = new Media({
            title: req.body.title || req.file.originalname,
            imageUrl: fileUrl,
            publicId: req.file.public_id,
            resourceType: req.file.resource_type || 'image',
        });
        
        await media.save();
        console.log('Media saved to DB:', media);
        
        res.json({ message: 'Uploaded!', data: media });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message || 'Upload failed' });
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
