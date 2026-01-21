const Customer = require('../models/Customer');

// @desc    Add a new customer
// @route   POST /api/customers
// @access  Private
const addCustomer = async (req, res) => {
    try {
        const {
            contactPersonName,
            companyName,
            contactNo,
            planType,
            companyDataURL,
            location,
            email,
            currentProduct,
            featureList,
        } = req.body;

        const customer = await Customer.create({
            contactPersonName,
            companyName,
            contactNo,
            planType,
            companyDataURL,
            location,
            email,
            currentProduct,
            featureList,
            user: req.user._id,
        });

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an existing customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, user: req.user._id });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const updatedCustomer = await Customer.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );

        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get customer details
// @route   GET /api/customers/:id
// @access  Private
const getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, user: req.user._id });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ user: req.user._id });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addCustomer,
    updateCustomer,
    getCustomer,
    getAllCustomers,
};
