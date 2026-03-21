const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const InventoryItem = require('../models/InventoryItem');
const Table = require('../models/Table');

// POST /api/orders
// Body expects: { tableId: "...", items: [{ menuItemId: "...", quantity: 2 }] }
router.post('/', async (req, res) => {
    try {
        const { tableId, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must contain items' });
        }

        let totalAmount = 0;
        const orderItems = [];
        const ingredientRequirements = {}; // inventoryItemId -> total required

        // 1. Validate menu items and calculate ingredients needed
        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItemId).populate('ingredients.inventoryItem');
            if (!menuItem) {
                return res.status(404).json({ error: `MenuItem with id ${item.menuItemId} not found` });
            }

            const itemTotal = menuItem.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                menuItem: menuItem._id,
                quantity: item.quantity,
                price: menuItem.price
            });

            // Accumulate required ingredients
            for (const ingredient of menuItem.ingredients) {
                const invId = ingredient.inventoryItem._id.toString();
                const requiredQty = ingredient.quantityRequired * item.quantity;

                if (ingredientRequirements[invId]) {
                    ingredientRequirements[invId] += requiredQty;
                } else {
                    ingredientRequirements[invId] = requiredQty;
                }
            }
        }

        // 2. Check inventory availability
        const inventoryUpdates = [];
        for (const [invId, requiredQty] of Object.entries(ingredientRequirements)) {
            const inventoryItem = await InventoryItem.findById(invId);
            if (!inventoryItem) {
                return res.status(500).json({ error: `InventoryItem ${invId} not found` });
            }

            if (inventoryItem.currentStock < requiredQty) {
                return res.status(400).json({
                    error: `Insufficient stock for ${inventoryItem.name}. Required: ${requiredQty}, Available: ${inventoryItem.currentStock}`
                });
            }

            inventoryUpdates.push({
                item: inventoryItem,
                newStock: inventoryItem.currentStock - requiredQty
            });
        }

        // 3. Deduct from inventory
        for (const update of inventoryUpdates) {
            update.item.currentStock = update.newStock;
            await update.item.save();
        }

        // 4. Create order
        const order = new Order({
            table: tableId || undefined,
            items: orderItems,
            totalAmount
        });

        await order.save();

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('items.menuItem')
            .populate('table');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
