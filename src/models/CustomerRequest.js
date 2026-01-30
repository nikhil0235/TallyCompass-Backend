const mongoose = require('mongoose');

const customerRequestSchema = new mongoose.Schema({

    customterList : {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        }],
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
        // "Only relevant for issue" - implies optional
    },
    requestTitle: { // "requestitle" in prompt, fixing typo to camelCase or readable
        type: String,
    },
    requestType: { // "RequesType"
        type: String,
        enum: ['issue', 'feature'],
        default: "feature"
    },
    description: {
        type: String,
    },
    priority : {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    action: {
        status: {
            type: String,
            enum: ['resolved', 'pending', 'review', 'cancelled'],
            default: 'pending'
        },
        description: {
            type: String
        }
    }
}, {
    timestamps: true
});

customerRequestSchema.post('save', function (doc) {
    const { syncDocument } = require('../utils/embeddingSync');
    syncDocument(doc, 'CustomerRequest');
});

customerRequestSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        const { syncDocument } = require('../utils/embeddingSync');
        const freshDoc = await doc.constructor.findById(doc._id);
        if (freshDoc) syncDocument(freshDoc, 'CustomerRequest');
    }
});

customerRequestSchema.post('findOneAndDelete', function (doc) {
    if (doc) {
        const { deleteDocumentEmbedding } = require('../utils/embeddingSync');
        deleteDocumentEmbedding(doc._id, 'CustomerRequest');
    }
});

module.exports = mongoose.model('CustomerRequest', customerRequestSchema);
