const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// POST /api/reservations
router.post('/', async (req, res) => {
    try {
        const { customerName, customerPhone, tableId, reservationTime, partySize } = req.body;

        // Check if table exists
        const table = await Table.findById(tableId);
        if (!table) return res.status(404).json({ error: 'Table not found' });

        // Simple availability logic: If status is 'available', we can reserve it.
        // A robust system would check reservations by time, but this suffices for base logic
        if (table.status !== 'available') {
            return res.status(400).json({ error: 'Table is not available' });
        }

        if (partySize > table.capacity) {
            return res.status(400).json({ error: 'Party size exceeds table capacity' });
        }

        const reservation = new Reservation({
            customerName,
            customerPhone,
            table: tableId,
            reservationTime: new Date(reservationTime),
            partySize
        });

        await reservation.save();

        // Update table status to 'reserved' based on reservation
        table.status = 'reserved';
        await table.save();

        res.status(201).json({ reservation, table });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/reservations
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('table');
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
