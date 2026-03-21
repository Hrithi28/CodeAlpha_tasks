const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const InventoryItem = require('../models/InventoryItem');

// GET /api/reports/sales
router.get('/sales', async (req, res) => {
    try {
        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        const result = salesData.length > 0 ? salesData[0] : { totalRevenue: 0, totalOrders: 0 };
        res.json({
            totalRevenue: result.totalRevenue || 0,
            totalOrders: result.totalOrders || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/reports/alerts
router.get('/alerts', async (req, res) => {
    try {
        // Find all inventory items where currentStock <= reorderLevel
        const lowStockItems = await InventoryItem.find({
            $expr: { $lte: ["$currentStock", "$reorderLevel"] }
        });

        res.json(lowStockItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
