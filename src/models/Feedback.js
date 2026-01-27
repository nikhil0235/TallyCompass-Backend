const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    medium: {
        type: String,
        enum: ['Email', 'Phone'] // "medium of feedback Email, Phone"
    },
    description: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
}, {
    timestamps: true // Adds createdAt/updatedAt automatically, covering "Date" if we want, but explicit Date field requested.
});

feedbackSchema.post('save', function (doc) {
    const { syncDocument } = require('../utils/embeddingSync');
    syncDocument(doc, 'Feedback');
});

feedbackSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        const { syncDocument } = require('../utils/embeddingSync');
        const freshDoc = await doc.constructor.findById(doc._id);
        if (freshDoc) syncDocument(freshDoc, 'Feedback');
    }
});

feedbackSchema.post('findOneAndDelete', function (doc) {
    if (doc) {
        const { deleteDocumentEmbedding } = require('../utils/embeddingSync');
        deleteDocumentEmbedding(doc._id, 'Feedback');
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
