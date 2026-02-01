const express = require('express');
const router = express.Router();
const { submitResponse, getAllFormResponses, getFormResponseById } = require('../controllers/formController');

router.post('/', submitResponse);
router.get('/', getAllFormResponses);
router.get('/:id', getFormResponseById);

module.exports = router;
