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

module.exports = mongoose.model('FormResponse', formResponseSchema);
