const CustomerRequest = require('../models/CustomerRequest');
const { checkAndSendMentions } = require('../utils/notification');

// @desc    Add a new customer request
// @route   POST /api/
// @access  Private
const addCustomerRequest = async (req, res) => {
    try {
        const customerRequest = await CustomerRequest.create(req.body);
        const populatedRequest = await CustomerRequest.findById(customerRequest._id)
            .populate('customterList')
            .populate('productId');
        if (req.body.description) {
            await checkAndSendMentions(req.body.description, 'CustomerRequest', customerRequest._id, req.user._id);
        }
        const response = populatedRequest.toObject();
        response.type = response.requestType;
        res.status(201).json(response);
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
        console.log('Updating customer request with data:', req.body);
        if (!customerRequest) {
            return res.status(404).json({ message: 'Customer Request not found' });
        }
        const allowedFields = ['requestTitle', 'description', 'requestType', 'priority', 'action'];
        const updateData = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        await CustomerRequest.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        const updatedCustomerRequest = await CustomerRequest.findById(req.params.id)
            .populate('customterList')
            .populate('productId');
        if (req.body.description) {
            await checkAndSendMentions(req.body.description, 'CustomerRequest', updatedCustomerRequest._id, req.user._id);
        }
        const response = updatedCustomerRequest.toObject();
        response.type = response.requestType;
        res.json(response);
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
            .populate('productId');
        if (!customerRequest) {
            return res.status(404).json({ message: 'Customer Request not found' });
        }
        const response = customerRequest.toObject();
        response.type = response.requestType;
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all customer requests
// @route   GET /api/customer-requests
// @access  Private
const getAllCustomerRequests = async (req, res) => {
    try {
        const customerRequests = await CustomerRequest.find()
            .populate('customterList')
            .populate('productId');
        const response = customerRequests.map(req => {
            const obj = req.toObject();
            obj.type = obj.requestType;
            return obj;
        });
        res.json(response);
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
