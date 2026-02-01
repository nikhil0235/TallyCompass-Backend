require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const VOC = require('../models/VOC');
const CustomerRequest = require('../models/CustomerRequest');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const FormResponse = require('../models/FormResponse');
const UnifiedEmbedding = require('../models/UnifiedEmbedding');
const { syncDocument } = require('../utils/embeddingSync');

const MONGODB_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const generateAllEmbeddings = async () => {
    await connectDB();

    console.log('Clearing existing embeddings...');
    await UnifiedEmbedding.deleteMany({});
    console.log('Collections cleared.');

    try {
        console.log('Processing Customers...');
        const customers = await Customer.find({});
        for (const doc of customers) {
            await syncDocument(doc, 'Customer');
        }

        console.log('Processing Products...');
        const products = await Product.find({});
        for (const doc of products) {
            await syncDocument(doc, 'Product');
        }

        console.log('Processing VOCs...');
        const vocs = await VOC.find({});
        for (const doc of vocs) {
            await syncDocument(doc, 'VOC');
        }

        console.log('Processing CustomerRequests...');
        const requests = await CustomerRequest.find({});
        for (const doc of requests) {
            await syncDocument(doc, 'CustomerRequest');
        }

        console.log('Processing Feedback...');
        const feedbacks = await Feedback.find({});
        for (const doc of feedbacks) {
            await syncDocument(doc, 'Feedback');
        }

        console.log('Processing Users...');
        const users = await User.find({});
        for (const doc of users) {
            await syncDocument(doc, 'User');
        }

        console.log('Processing FormResponses...');
        const formResponses = await FormResponse.find({});
        for (const doc of formResponses) {
            await syncDocument(doc, 'FormResponse');
        }

        console.log('All embeddings generated successfully!');
    } catch (error) {
        console.error('Error generating embeddings:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

generateAllEmbeddings();
