const Joi = require('joi');

const registerSchema = Joi.object({
     name: Joi.string()
          .trim()
          .min(2)
          .max(50)
          .required(),

     email: Joi.string()
          .email()
          .lowercase()
          .required(),

     password: Joi.string()
          .min(6)
          .max(50)
          .required(),

     role: Joi.string()
          .valid('admin', 'manager', 'staff')
          .optional(),
});


const loginSchema = Joi.object({
     email: Joi.string()
          .email()
          .lowercase()
          .required(),

     password: Joi.string()
          .required(),
});


module.exports = {
     registerSchema,
     loginSchema,
};