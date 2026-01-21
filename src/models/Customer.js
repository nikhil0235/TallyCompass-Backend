const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    contactPersonName: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
    planType: {
        type: String,
        required: true,
    },
    companyDataURL: {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    currentProduct: {
        type: String,
    },
    featureList: [{
        type: String
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Customer', customerSchema);
