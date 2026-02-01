const FormResponse = require('../models/FormResponse');

/**
 * Handle form submission
 * @route POST /api/forms
 * @access Public
 */
exports.submitResponse = async (req, res) => {
    try {
        const { formId, title, email, answers } = req.body;
        console.log(req.body);

        // Basic validation
        if (!answers || !Array.isArray(answers)) {
            console.log("Error while submitting form");
            const newResponse = new FormResponse({
                rawResponse: req.body
            });
            await newResponse.save();

            return res.status(400).json({ success: false, message: 'Answers array is required' });
        }

        const newResponse = new FormResponse({
            formId,
            title,
            email,
            answers,
            rawResponse: req.body
        });

        await newResponse.save();

        res.status(201).json({
            success: true,
            data: newResponse,
            message: 'Form response saved successfully'
        });
    } catch (error) {
        console.error('Error saving form response:', error);

        const newResponse = new FormResponse({
            rawResponse: req.body,
            title: "Error Form"
        });
        await newResponse.save();

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Get all form responses
 * @route GET /api/forms
 * @access Public
 */
exports.getAllFormResponses = async (req, res) => {
    try {
        const responses = await FormResponse.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: responses.length,
            data: responses
        });
    } catch (error) {
        console.error('Error fetching form responses:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Get single form response by ID
 * @route GET /api/forms/:id
 * @access Public
 */
exports.getFormResponseById = async (req, res) => {
    try {
        const response = await FormResponse.findById(req.params.id);

        if (!response) {
            return res.status(404).json({
                success: false,
                message: 'Form response not found'
            });
        }

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error('Error fetching form response:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
