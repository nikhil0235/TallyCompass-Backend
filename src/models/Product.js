const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    version: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
    }
}, {
    timestamps: true,
});

productSchema.post('save', function (doc) {
    const { syncDocument } = require('../utils/embeddingSync');
    syncDocument(doc, 'Product');
});

productSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        const { syncDocument } = require('../utils/embeddingSync');
        const freshDoc = await doc.constructor.findById(doc._id);
        if (freshDoc) syncDocument(freshDoc, 'Product');
    }
});

productSchema.post('findOneAndDelete', function (doc) {
    if (doc) {
        const { deleteDocumentEmbedding } = require('../utils/embeddingSync');
        deleteDocumentEmbedding(doc._id, 'Product');
    }
});

module.exports = mongoose.model('Product', productSchema);
