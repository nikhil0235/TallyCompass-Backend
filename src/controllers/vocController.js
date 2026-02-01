const VOC = require('../models/VOC');


// @desc    Add a new VOC
// @route   POST /api/voc
// @access  Private
const addVOC = async (req, res) => {
    try {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('User ID:', req.user?._id);
        
        // Fix field name mismatch
        if (req.body.productID) {
            req.body.ProductID = req.body.productID;
            delete req.body.productID;
        }
        
        // Transform customerDetailsObj if it exists
        if (req.body.customerDetailsObj) {
            const customerDetails = req.body.customerDetailsObj;
            
            // Handle customerID - can be string or object
            if (customerDetails.customerID && Array.isArray(customerDetails.customerID)) {
                customerDetails.customerID = customerDetails.customerID.map(item => 
                    typeof item === 'string' ? item : item.customerID
                ).filter(Boolean);
            }
            
            // Handle feedbackID - can be string or object
            if (customerDetails.feedbackID && Array.isArray(customerDetails.feedbackID)) {
                customerDetails.feedbackID = customerDetails.feedbackID.map(item => 
                    typeof item === 'string' ? item : item.feedbackID
                ).filter(Boolean);
            }
            
            // Handle customerRequestID - can be string or object
            if (customerDetails.customerRequestID && Array.isArray(customerDetails.customerRequestID)) {
                customerDetails.customerRequestID = customerDetails.customerRequestID.map(item => 
                    typeof item === 'string' ? item : item.requestID
                ).filter(Boolean);
            }
            
            console.log('Transformed customerDetailsObj:', customerDetails);
        }
        
        const voc = await VOC.create({ ...req.body, userID: req.user._id });
        
        if (req.body.description || (req.body.stakeHolders && req.body.stakeHolders.length > 0)) {
            const { sendNotifications } = require('../utils/notification');
            await sendNotifications(req.body.description, 'VOC', voc._id, req.user._id, req.body.stakeHolders);
        }
        console.log(`VOC created with ID: ${voc._id} by User: ${req.user._id}`);
        res.status(201).json(voc);
    } catch (error) {
        console.error('Error creating VOC:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: error.message, details: error.toString() });
    }
};

// @desc    Update an existing VOC
// @route   PUT /api/voc/:id
// @access  Private
const updateVOC = async (req, res) => {
    try {
        console.log('UPDATE VOC - Request body:', JSON.stringify(req.body, null, 2));
        console.log('UPDATE VOC - VOC ID:', req.params.id);
        console.log('UPDATE VOC - User ID:', req.user?._id);
        
        const voc = await VOC.findOne({ _id: req.params.id });
        
        if (!voc) {
            return res.status(404).json({ message: 'VOC not found' });
        }
        
        // Fix field name mismatch
        if (req.body.productID) {
            req.body.ProductID = req.body.productID;
            delete req.body.productID;
        }
        
        // Transform customerDetailsObj if it exists
        if (req.body.customerDetailsObj) {
            const customerDetails = req.body.customerDetailsObj;
            console.log('UPDATE VOC - CustomerDetailsObj received:', customerDetails);
            
            // Handle customerID - can be string or object
            if (customerDetails.customerID && Array.isArray(customerDetails.customerID)) {
                customerDetails.customerID = customerDetails.customerID.map(item => 
                    typeof item === 'string' ? item : item.customerID
                ).filter(Boolean);
            }
            
            // Handle feedbackID - can be string or object
            if (customerDetails.feedbackID && Array.isArray(customerDetails.feedbackID)) {
                customerDetails.feedbackID = customerDetails.feedbackID.map(item => 
                    typeof item === 'string' ? item : item.feedbackID
                ).filter(Boolean);
            }
            
            // Handle customerRequestID - can be string or object
            if (customerDetails.customerRequestID && Array.isArray(customerDetails.customerRequestID)) {
                customerDetails.customerRequestID = customerDetails.customerRequestID.map(item => 
                    typeof item === 'string' ? item : item.requestID
                ).filter(Boolean);
            }
            
            console.log('UPDATE VOC - Transformed customerDetailsObj:', customerDetails);
        }
        
        const updatedVOC = await VOC.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const stakeholders = req.body.stakeHolders || updatedVOC.stakeHolders;
        if (req.body.description || (stakeholders && stakeholders.length > 0)) {
            const { sendNotifications } = require('../utils/notification');
            await sendNotifications(req.body.description, 'VOC', updatedVOC._id, req.user._id, stakeholders);
        }
        console.log(`UPDATE VOC - VOC updated with ID: ${updatedVOC._id}`);
        res.json(updatedVOC);
    } catch (error) {
        console.error('UPDATE VOC - Error:', error);
        console.error('UPDATE VOC - Error stack:', error.stack);
        res.status(500).json({ message: error.message, details: error.toString() });
    }
};

// @desc    Get VOC details
// @route   GET /api/voc/:id
// @access  Private
const getVOC = async (req, res) => {
    try {
        const voc = await VOC.findById(req.params.id).populate('userID').populate('ProductID');
        if (!voc) {
            return res.status(404).json({ message: 'VOC not found' });
        }
        res.json(voc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all VOCs (with filters)
// @route   GET /api/voc
// @access  Private
const getAllVOCs = async (req, res) => {
    try {
        const queryObj = { ...req.query };
        // Basic filtering logic can be added here if needed, e.g., ?Status=Open
        // req.query automatically handles simple key-value pairs which match Mongoose structure.

        const vocs = await VOC.find(queryObj);
        res.json(vocs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a VOC
// @route   DELETE /api/voc/:id
// @access  Private
const deleteVOC = async (req, res) => {
    try {
        const voc = await VOC.findById(req.params.id);
        if (!voc) {
            return res.status(404).json({ message: 'VOC not found' });
        }
        await VOC.findByIdAndDelete(req.params.id);
        res.json({ message: 'VOC removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addVOC,
    updateVOC,
    getVOC,
    getAllVOCs,
    deleteVOC
};
