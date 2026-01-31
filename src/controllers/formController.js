const FormResponse = require('../models/FormResponse');

/**
 * Handle form submission
 * @route POST /api/forms
 * @access Public
 */
exports.submitResponse = async (req, res) => {
    try {
        const { formId, title, email, answers } = req.body;

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
