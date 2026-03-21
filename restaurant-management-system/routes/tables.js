const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

// GET /api/tables
router.get('/', async (req, res) => {
    try {
        const tables = await Table.find();
        res.json(tables);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/tables (seed data)
router.post('/', async (req, res) => {
    try {
        const table = new Table(req.body);
        await table.save();
        res.status(201).json(table);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
