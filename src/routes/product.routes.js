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
     '/',
     authMiddleware,
     getProducts
);

router.post(
     '/',
     authMiddleware,
     createProduct
);

router.get(
     '/:id',
     authMiddleware,
     getProductById
);

router.put(
     '/:id',
     authMiddleware,
     updateProduct
);

router.delete(
     '/:id',
     authMiddleware,
     deleteProduct
);

module.exports = router;