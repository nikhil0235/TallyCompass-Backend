const mongoose = require('mongoose');

const unifiedEmbeddingSchema = new mongoose.Schema({
    sourceCollection: {
        type: String,
        required: true,
        enum: ['Customer', 'Product', 'VOC', 'CustomerRequest', 'Feedback']
    },
    sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'sourceCollection'
    },
    text: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number],
        required: true
        // Index will be created in Atlas
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UnifiedEmbedding', unifiedEmbeddingSchema);
