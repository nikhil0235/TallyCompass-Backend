const Feedback = require('../modules/Feedback');

// @desc    Add a new feedback
// @route   POST /api/feedback
// @access  Private
const addFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.create(req.body);
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an existing feedback
// @route   PUT /api/feedback/:id
// @access  Private
const updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedFeedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get feedback details
// @route   GET /api/feedback/:id
// @access  Private
const getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id).populate('customerId');
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all feedbacks
// @route   GET /api/feedback
// @access  Private
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find(req.query).populate('customerId');
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a feedback
// @route   DELETE /api/feedback/:id
// @access  Private
const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ message: 'Feedback removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addFeedback,
    updateFeedback,
    getFeedback,
    getAllFeedbacks,
    deleteFeedback
};
