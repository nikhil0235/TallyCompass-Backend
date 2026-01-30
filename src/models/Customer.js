const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    contactPersonName: {
        type: String
    },
    companyName: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
    businessType: {
        type: String,
    },
    planType: {
        type: String,
    },
    accountStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    customerProficiency: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
    },
    companyDataURL: {
        type: String,
    },
    location: {
        country: {
            type: String,
        },
        state: {
            type: String,
        },
        city: {
            type: String,
        },
        pincode: {
            type: String,
        },
        isInternational: {
            type: Boolean,
            default: false,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    currentProductID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    featureList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feature'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true,
});

customerSchema.post('save', function (doc) {
    const { syncDocument } = require('../utils/embeddingSync');
    syncDocument(doc, 'Customer');
});

customerSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        const { syncDocument } = require('../utils/embeddingSync');
        const freshDoc = await doc.constructor.findById(doc._id);
        if (freshDoc) syncDocument(freshDoc, 'Customer');
    }
});

customerSchema.post('findOneAndDelete', function (doc) {
    if (doc) {
        const { deleteDocumentEmbedding } = require('../utils/embeddingSync');
        deleteDocumentEmbedding(doc._id, 'Customer');
    }
});

module.exports = mongoose.model('Customer', customerSchema);
