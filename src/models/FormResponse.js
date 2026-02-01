const mongoose = require('mongoose');

const formResponseSchema = new mongoose.Schema({
    formId: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    answers: [{
        question: String,
        answer: mongoose.Schema.Types.Mixed // Can be string, array (checkboxes), etc.
    }],
    rawResponse: {
        type: Object, // Store the full payload just in case
        required: false
    }
}, {
    timestamps: true
});

formResponseSchema.post('save', function (doc) {
    const { syncDocument } = require('../utils/embeddingSync');
    syncDocument(doc, 'FormResponse');
});

formResponseSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        const { syncDocument } = require('../utils/embeddingSync');
        const freshDoc = await doc.constructor.findById(doc._id);
        if (freshDoc) syncDocument(freshDoc, 'FormResponse');
    }
});

formResponseSchema.post('findOneAndDelete', function (doc) {
    if (doc) {
        const { deleteDocumentEmbedding } = require('../utils/embeddingSync');
        deleteDocumentEmbedding(doc._id, 'FormResponse');
    }
});

module.exports = mongoose.model('FormResponse', formResponseSchema);
