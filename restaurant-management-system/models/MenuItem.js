const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String, // e.g., 'Appetizers', 'Mains', 'Desserts'
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    ingredients: [{
        inventoryItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InventoryItem',
            required: true
        },
        quantityRequired: {
            type: Number,
            required: true
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
