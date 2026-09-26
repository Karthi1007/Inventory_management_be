const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
     {
          name: {
               type: String,
               required: true,
               trim: true,
          },

          sku: {
               type: String,
               required: true,
               unique: true,
               uppercase: true,
               trim: true,
          },

          category: {
               type: String,
               required: true,
               trim: true,
          },

          description: {
               type: String,
               trim: true,
               default: '',
          },

          price: {
               type: Number,
               required: true,
               min: 0,
          },

          stock: {
               type: Number,
               required: true,
               min: 0,
               default: 0,
          },

          status: {
               type: String,
                trim: true,
               default: 'In Stock',
          },

          createdBy: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
          },
     },
     {
          timestamps: true,
     }
);

module.exports = mongoose.model('Product', productSchema);