const express = require('express');
const router = express.Router();
const {
    addCustomer,
    updateCustomer,
    getCustomer,
    getAllCustomers,
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getAllCustomers)
    .post(addCustomer);

router.route('/:id')
    .get(getCustomer)
    .put(updateCustomer);

module.exports = router;
