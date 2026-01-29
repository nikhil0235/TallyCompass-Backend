const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Get the latest dashboard stats
router.get('/', dashboardController.getDashboardStats);

// Create new dashboard stats
router.post('/', dashboardController.createDashboardStats);

// Update dashboard stats by ID
router.put('/:id', dashboardController.updateDashboardStats);

// Delete dashboard stats by ID
router.delete('/:id', dashboardController.deleteDashboardStats);

module.exports = router;
