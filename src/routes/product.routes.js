const express = require('express');

const authMiddleware = require('../middleware/auth.middleware');

const {
     getProducts,
     createProduct,
     getProductById,
     updateProduct,
     deleteProduct,
} = require('../controllers/product.controller');

const router = express.Router();

router.get(
     '/getall',
     authMiddleware,
     getProducts
);

router.post(
     '/addProd',
     authMiddleware,
     createProduct
);

router.get(
     '/getById/:id',
     authMiddleware,
     getProductById
);

router.put(
     '/UpdateProd/:id',
     authMiddleware,
     updateProduct
);

router.delete(
     '/delete/:id',
     authMiddleware,
     deleteProduct
);

module.exports = router;