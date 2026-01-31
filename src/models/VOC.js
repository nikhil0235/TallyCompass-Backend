const mongoose = require('mongoose');

const vocSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    connectType: {
        type: String,
        enum: ['VOC', 'Management', 'Event', 'Other'],
        default: 'VOC'
    },
    connectName: {
        type: String,
        // For events, this can be Founder's Day etc. 
        // For VOCs, this can be JSON VOC etc.
        // For ManagementMeet, this can be CIS Meet
    },
    stakeHolders: [{ // all the required stakeholders for that VOC.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    vocStartDate: {
        type: Date,
    },
    vocEndDate: {
        type: Date,
    },
    projectName: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
        default: 'Upcoming'
    },
    description: {
        type: String
    },
    customerDetailsObj: {
        feedbackID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Feedback'
        }],
        customerRequestID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CustomerRequest'
        }],
        customerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Cancelled'],
            default: 'Pending'
        }
    },
    mediaList: [{
        mediaType: {
            type: String
        },
        mediaDescription: {
            type: String,
        },
        mediaURL: {
            type: String,
        }
    }],
    ProductID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
}, {
    timestamps: true,
});

vocSchema.post('save', function (doc) {
    const { syncDocument } = require('../utils/embeddingSync');
    syncDocument(doc, 'VOC');
});

vocSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        const { syncDocument } = require('../utils/embeddingSync');
        const freshDoc = await doc.constructor.findById(doc._id);
        if (freshDoc) syncDocument(freshDoc, 'VOC');
    }
});

vocSchema.post('findOneAndDelete', function (doc) {
    if (doc) {
        const { deleteDocumentEmbedding } = require('../utils/embeddingSync');
        deleteDocumentEmbedding(doc._id, 'VOC');
    }
});

module.exports = mongoose.model('VOC', vocSchema);
