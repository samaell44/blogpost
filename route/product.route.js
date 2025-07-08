const express = require('express');
const router = express.Router();
const {getAllProducts,getProductById,createProduct,updateProduct,deleteProduct} = require('../controller/product.controller.js');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
