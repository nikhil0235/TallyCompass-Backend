const express = require('express');
const router = express.Router();
const {
    addCustomerRequest,
    updateCustomerRequest,
    getCustomerRequest,
    getAllCustomerRequests,
    deleteCustomerRequest
} = require('../controllers/customerRequestController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getAllCustomerRequests)
    .post(addCustomerRequest);

router.route('/:id')
    .get(getCustomerRequest)
    .put(updateCustomerRequest)
    .delete(deleteCustomerRequest);

module.exports = router;
