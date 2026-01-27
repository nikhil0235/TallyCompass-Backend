const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware'); // Add auth if needed

router.use(protect);

router.post('/query', searchController.search);

module.exports = router;
