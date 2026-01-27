const express = require('express');
const router = express.Router();
const {
    addFeedback,
    updateFeedback,
    getFeedback,
    getAllFeedbacks,
    deleteFeedback
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getAllFeedbacks)
    .post(addFeedback);

router.route('/:id')
    .get(getFeedback)
    .put(updateFeedback)
    .delete(deleteFeedback);

module.exports = router;
