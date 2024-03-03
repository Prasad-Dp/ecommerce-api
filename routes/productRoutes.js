const express = require('express');
const {
    createProductCtrl,
    productListCtrl,
    productDetails,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const fileUpload=require('../config/fileUplods')
const adminMiddleware=require('../middlewares/adminMiddleware')

const productRoutes = express.Router();

// Use '/create' as the route for creating a product
productRoutes.post('/create', authMiddleware,adminMiddleware,fileUpload.array('files'), createProductCtrl);

// Use '/product' as the route for getting the product list
productRoutes.get('/', productListCtrl);

// Use '/product/:productId' for getting details and updating a product
productRoutes.route('/:productId')
    .get(productDetails)
    .put(authMiddleware,adminMiddleware, updateProduct)
    .delete(authMiddleware,adminMiddleware,deleteProduct)

module.exports = productRoutes;
