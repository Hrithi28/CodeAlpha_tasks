const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');

// GET /api/inventory
router.get('/', async (req, res) => {
    try {
        const items = await InventoryItem.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/inventory (to seed data or create new materials)
router.post('/', async (req, res) => {
    try {
        const item = new InventoryItem(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/inventory/:id
router.put('/:id', async (req, res) => {
    try {
        const { currentStock, reorderLevel, name, unit } = req.body;
        const item = await InventoryItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        if (currentStock !== undefined) item.currentStock = currentStock;
        if (reorderLevel !== undefined) item.reorderLevel = reorderLevel;
        if (name !== undefined) item.name = name;
        if (unit !== undefined) item.unit = unit;

        await item.save();
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
