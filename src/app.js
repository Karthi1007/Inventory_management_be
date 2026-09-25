const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
// const productRoutes = require('./routes/product.routes');
// const stockRoutes = require('./routes/stock.routes');

const app = express();
app.use(cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Health Check */
app.get('/api/health', (req, res) => {
     res.status(200).json({
          success: true,
          message: 'Inventory AI API is running',
     });
});

/* Routes */
app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/stocks', stockRoutes);


/* 404 */
app.use((req, res)=>{
    res.status(404).json({
        success: false,
        message: 'Route not found',
    })
})

/* Error Handler */
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })
})

module.exports = app;