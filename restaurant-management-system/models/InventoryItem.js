const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  reorderLevel: {
    type: Number,
    required: true,
    default: 10
  },
  unit: {
    type: String, // e.g., 'kg', 'liters', 'pieces'
    default: 'units'
  }
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
