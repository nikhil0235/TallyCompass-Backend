const express = require('express');
const router = express.Router();
const { submitResponse } = require('../controllers/formController');

router.post('/', submitResponse);

module.exports = router;
