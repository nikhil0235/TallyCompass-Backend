// Module for media-related business logic
const mongoose = require('mongoose');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
	cloudinary,
	params: async () => ({
		folder: 'my_app_media',
		resource_type: 'auto',
		allowed_formats: [
			'jpg','png','jpeg','gif','webp',
			'mp4','mov','avi','mkv','webm'
		],
	}),
});

const upload = multer({ storage });

const mediaSchema = new mongoose.Schema({
	title: String,
	imageUrl: String,
	publicId: String,
	resourceType: String,
	uploadedAt: { type: Date, default: Date.now },
});

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);

module.exports = {
	upload,
	Media,
	cloudinary
};
