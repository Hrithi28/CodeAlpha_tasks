const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// GET /api/menu
router.get('/', async (req, res) => {
    try {
        const menu = await MenuItem.find({ isAvailable: true }).populate('ingredients.inventoryItem');
        res.json(menu);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/menu (admin or testing purpose to seed data)
router.post('/', async (req, res) => {
    try {
        const menuItem = new MenuItem(req.body);
        await menuItem.save();
        res.status(201).json(menuItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
