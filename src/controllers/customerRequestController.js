const CustomerRequest = require('../modules/CustomerRequest');

// @desc    Add a new customer request
// @route   POST /api/customer-requests
// @access  Private
const addCustomerRequest = async (req, res) => {
    try {
        const customerRequest = await CustomerRequest.create(req.body);
        res.status(201).json(customerRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an existing customer request
// @route   PUT /api/customer-requests/:id
// @access  Private
const updateCustomerRequest = async (req, res) => {
    try {
        const customerRequest = await CustomerRequest.findById(req.params.id);
        if (!customerRequest) {
            return res.status(404).json({ message: 'Customer Request not found' });
        }
        const updatedCustomerRequest = await CustomerRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCustomerRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get customer request details
// @route   GET /api/customer-requests/:id
// @access  Private
const getCustomerRequest = async (req, res) => {
    try {
        const customerRequest = await CustomerRequest.findById(req.params.id)
            .populate('CustomerId')
            .populate('ProductID');
        if (!customerRequest) {
            return res.status(404).json({ message: 'Customer Request not found' });
        }
        res.json(customerRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all customer requests
// @route   GET /api/customer-requests
// @access  Private
const getAllCustomerRequests = async (req, res) => {
    try {
        const customerRequests = await CustomerRequest.find(req.query)
            .populate('CustomerId')
            .populate('ProductID');
        res.json(customerRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a customer request
// @route   DELETE /api/customer-requests/:id
// @access  Private
const deleteCustomerRequest = async (req, res) => {
    try {
        const customerRequest = await CustomerRequest.findById(req.params.id);
        if (!customerRequest) {
            return res.status(404).json({ message: 'Customer Request not found' });
        }
        await CustomerRequest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Customer Request removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addCustomerRequest,
    updateCustomerRequest,
    getCustomerRequest,
    getAllCustomerRequests,
    deleteCustomerRequest
};
