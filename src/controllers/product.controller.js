const mongoose = require('mongoose');

const Product = require('../models/Product');

const {
     createProductSchema,
     updateProductSchema,
} = require('../validations/product.validation');


// ==========================================
// GET ALL PRODUCTS
// GET /api/products
// ==========================================

const getProducts = async (req, res, next) => {
     try {
          const {
               search,
               category,
               status,
               page = 1,
               limit = 10,
          } = req.query;


          const filter = {};


          // Search
          if (search) {
               filter.$or = [
                    {
                         name: {
                              $regex: search,
                              $options: 'i',
                         },
                    },
                    {
                         sku: {
                              $regex: search,
                              $options: 'i',
                         },
                    },
               ];
          }


          // Category filter
          if (category) {
               filter.category = category;
          }


          // Status filter
          if (status) {
               filter.status = status;
          }


          const pageNumber = Math.max(
               Number(page),
               1
          );

          const limitNumber = Math.min(
               Math.max(Number(limit), 1),
               100
          );

          const skip =
               (pageNumber - 1) * limitNumber;


          const [
               products,
               totalProducts,
          ] = await Promise.all([
               Product.find(filter)
                    .sort({
                         createdAt: -1,
                    })
                    .skip(skip)
                    .limit(limitNumber),

               Product.countDocuments(filter),
          ]);


          return res.status(200).json({
               success: true,

               data: products,

               pagination: {
                    page: pageNumber,
                    limit: limitNumber,
                    total: totalProducts,
                    totalPages: Math.ceil(
                         totalProducts / limitNumber
                    ),
               },
          });

     } catch (error) {
          next(error);
     }
};


// ==========================================
// GET PRODUCT BY ID
// GET /api/products/:id
// ==========================================

const getProductById = async (req, res, next) => {
     try {
         const id = req.params.id;


          if (!mongoose.Types.ObjectId.isValid(id)) {
               return res.status(400).json({
                    success: false,
                    message: 'Invalid product ID',
               });
          }


          const product = await Product.findById(id);


          if (!product) {
               return res.status(404).json({
                    success: false,
                    message: 'Product not found',
               });
          }


          return res.status(200).json({
               success: true,
               data: product,
          });

     } catch (error) {
          next(error);
     }
};


// ==========================================
// CREATE PRODUCT
// POST /api/products
// ==========================================

const createProduct = async (req, res, next) => {
     try {
          const { error, value } = createProductSchema.validate(req.body,
               {
                    abortEarly: false,
               }
          );

          if (error) {
               return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.details.map(
                         (detail) => detail.message
                    ),
               });
          }

          const {  name,  sku, category,  description,  price, stock,  status, } = value;

          // Check duplicate SKU
          const existingProduct =
               await Product.findOne({
                    sku: sku.toUpperCase(),
               });

          if (existingProduct) {
               return res.status(409).json({
                    success: false,
                    message: 'Product SKU already exists',
               });
          }


          const product = await Product.create({
               name,
               sku: sku.toUpperCase(),
               category,
               description,
               price,
               stock,
               status,
               createdBy: req.user.userId,
          });


          return res.status(201).json({
               success: true,
               message: 'Product created successfully',
               data: product,
          });

     } catch (error) {
          next(error);
     }
};


// ==========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ==========================================

const updateProduct = async (req, res, next) => {
     try {
          const { id } = req.params;


          if (!mongoose.Types.ObjectId.isValid(id)) {
               return res.status(400).json({
                    success: false,
                    message: 'Invalid product ID',
               });
          }


          const {
               error,
               value,
          } = updateProductSchema.validate(
               req.body,
               {
                    abortEarly: false,
               }
          );


          if (error) {
               return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.details.map(
                         (detail) => detail.message
                    ),
               });
          }


          const product =
               await Product.findById(id);


          if (!product) {
               return res.status(404).json({
                    success: false,
                    message: 'Product not found',
               });
          }


          // Check duplicate SKU
          if (value.sku) {
               const existingProduct =
                    await Product.findOne({
                         sku: value.sku.toUpperCase(),
                         _id: {
                              $ne: id,
                         },
                    });


               if (existingProduct) {
                    return res.status(409).json({
                         success: false,
                         message: 'Product SKU already exists',
                    });
               }


               value.sku =
                    value.sku.toUpperCase();
          }


          Object.assign(product, value);

          await product.save();


          return res.status(200).json({
               success: true,
               message: 'Product updated successfully',
               data: product,
          });

     } catch (error) {
          next(error);
     }
};


// ==========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ==========================================

const deleteProduct = async (req, res, next) => {
     try {
          const { id } = req.params;


          if (!mongoose.Types.ObjectId.isValid(id)) {
               return res.status(400).json({
                    success: false,
                    message: 'Invalid product ID',
               });
          }

          const product = await Product.findById(id);

          if (!product) {
               return res.status(404).json({
                    success: false,
                    message: 'Product not found',
               });
          }

          await Product.findByIdAndDelete(id);

          return res.status(200).json({
               success: true,
               message: 'Product deleted successfully',
          });

     } catch (error) {
          next(error);
     }
};

module.exports = {
     getProducts,
     createProduct,
     getProductById,
     updateProduct,
     deleteProduct,
};