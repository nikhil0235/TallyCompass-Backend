const express = require('express');
const router = express.Router();
const {
  addFeature,
  getAllFeatures,
  getFeature,
  deleteFeature
} = require('../controllers/featureController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getAllFeatures)
  .post(addFeature);

router.route('/:id')
  .get(getFeature)
  .delete(deleteFeature);

module.exports = router;
