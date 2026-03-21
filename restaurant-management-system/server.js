const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load routers
const menuRoutes = require('./routes/menu');
const inventoryRoutes = require('./routes/inventory');
const tablesRoutes = require('./routes/tables');
const reservationsRoutes = require('./routes/reservations');
const ordersRoutes = require('./routes/orders');
const reportsRoutes = require('./routes/reports');

// Apply routes
app.use('/api/menu', menuRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reports', reportsRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
