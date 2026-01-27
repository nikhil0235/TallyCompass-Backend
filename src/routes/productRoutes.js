const express = require('express');
const router = express.Router();
const {
    addProduct,
    updateProduct,
    getProduct,
    getAllProducts,
    deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getAllProducts)
    .post(addProduct);

router.route('/:id')
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;
