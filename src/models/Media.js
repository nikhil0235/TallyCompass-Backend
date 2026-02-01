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

console.log('Cloudinary configured with:', {
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
	api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
});

const storage = new CloudinaryStorage({
	cloudinary,
	params: async (req, file) => {
		console.log('Cloudinary params called for file:', file.originalname);
		try {
			const params = {
				folder: 'my_app_media',
				resource_type: 'auto',
				allowed_formats: [
					'jpg','png','jpeg','gif','webp',
					'mp4','mov','avi','mkv','webm'
				],
				quality: 'auto',
				fetch_format: 'auto'
			};
			console.log('Cloudinary params:', params);
			return params;
		} catch (error) {
			console.error('Error in Cloudinary params:', error);
			throw error;
		}
	},
});

const upload = multer({ 
	storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		console.log('File filter called for:', file.originalname);
		if (!file) return cb(new Error('No file provided'));
		cb(null, true);
	},
	onError: (err, next) => {
		console.error('Multer error:', err);
		next(err);
	}
});

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
