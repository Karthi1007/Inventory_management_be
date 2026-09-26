const Joi = require('joi');

const createProductSchema = Joi.object({
     name: Joi.string()
          .trim()
          .min(2)
          .max(100)
          .required(),

     sku: Joi.string()
          .trim()
          .min(2)
          .max(50)
          .required(),

     category: Joi.string()
          .trim()
          .min(2)
          .max(50)
          .required(),

     description: Joi.string()
          .trim()
          .max(500)
          .allow('')
          .optional(),

     price: Joi.number()
          .min(0)
          .required(),

     stock: Joi.number()
          .integer()
          .min(0)
          .required(),

     status: Joi.string()
          .trim()
          .min(2)
          .max(50)
          .optional(),
});


const updateProductSchema = Joi.object({
     name: Joi.string()
          .trim()
          .min(2)
          .max(100)
          .optional(),

     sku: Joi.string()
          .trim()
          .min(2)
          .max(50)
          .optional(),

     category: Joi.string()
          .trim()
          .min(2)
          .max(50)
          .optional(),

     description: Joi.string()
          .trim()
          .max(500)
          .allow('')
          .optional(),

     price: Joi.number()
          .min(0)
          .optional(),

     stock: Joi.number()
          .integer()
          .min(0)
          .optional(),

     status: Joi.string()
          .trim()
          .min(2)
          .max(50)
          .optional(),
}).min(1);


module.exports = {
     createProductSchema,
     updateProductSchema,
};