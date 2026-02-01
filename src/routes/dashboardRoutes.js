const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');


// Get real-time dashboard stats
router.get('/', dashboardController.getDashboardStats);

module.exports = router;
