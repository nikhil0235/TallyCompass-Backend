const express = require('express');
const router = express.Router();
const {
    addVOC,
    updateVOC,
    getVOC,
    getAllVOCs,
    deleteVOC
} = require('../controllers/vocController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getAllVOCs)
    .post(addVOC);

router.route('/:id')
    .get(getVOC)
    .put(updateVOC)
    .delete(deleteVOC);

module.exports = router;
