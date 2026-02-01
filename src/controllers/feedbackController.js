const Feedback = require('../models/Feedback');
const { checkAndSendMentions } = require('../utils/notification');

// @desc    Add a new feedback
// @route   POST /api/feedback
// @access  Private
const addFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.create(req.body);
        if (req.body.description) {
            await checkAndSendMentions(req.body.description, 'Feedback', feedback._id, req.user._id);
        }
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
        console.log('Updating feedback with data:', req.body);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        const allowedFields = ['description', 'rating', 'medium'];
        const updateData = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        console.log('Update data to save:', updateData);
        const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        console.log('Updated feedback:', updatedFeedback);
        if (req.body.description) {
            await checkAndSendMentions(req.body.description, 'Feedback', updatedFeedback._id, req.user._id).catch(err => console.error('Mention error:', err));
        }
        res.json(updatedFeedback);
    } catch (error) {
        console.error('updateFeedback error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get feedback details
// @route   GET /api/feedback/:id
// @access  Private
const getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        const populatedFeedback = await Feedback.findById(req.params.id).populate('customerId');
        res.json(populatedFeedback || feedback);
    } catch (error) {
        console.error('getFeedback error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all feedbacks
// @route   GET /api/feedback
// @access  Private
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find(req.query).populate('customerId').catch(err => {
            console.error('Populate error:', err);
            return [];
        });
        res.json(feedbacks);
    } catch (error) {
        console.error('getAllFeedbacks error:', error);
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
