const VOC = require('../models/VOC');


// @desc    Add a new VOC
// @route   POST /api/voc
// @access  Private
const addVOC = async (req, res) => {
    try {
        const voc = await VOC.create({ ...req.body, userID: req.user._id }); // Assign current user
        if (req.body.description || (req.body.stakeHolders && req.body.stakeHolders.length > 0)) {
            const { sendNotifications } = require('../utils/notification');
            await sendNotifications(req.body.description, 'VOC', voc._id, req.user._id, req.body.stakeHolders);
        }
        res.status(201).json(voc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an existing VOC
// @route   PUT /api/voc/:id
// @access  Private
const updateVOC = async (req, res) => {
    try {
        const voc = await VOC.findOne({ _id: req.params.id });
        // Note: Check if we want to restrict update to creator? Assuming shared access for now based on prompt, or check UserID?
        // Let's assume broad access for authorized users for now as per "routes to add/alter...".

        if (!voc) {
            return res.status(404).json({ message: 'VOC not found' });
        }
        const updatedVOC = await VOC.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const stakeholders = req.body.stakeHolders || updatedVOC.stakeHolders;
        if (req.body.description || (stakeholders && stakeholders.length > 0)) {
            const { sendNotifications } = require('../utils/notification');
            await sendNotifications(req.body.description, 'VOC', updatedVOC._id, req.user._id, stakeholders);
        }
        res.json(updatedVOC);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
