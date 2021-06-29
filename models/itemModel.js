const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seller: {
    type: String,
    default: 'edge',
  },
  discount: {
    type: Number,
    dedfault: 0,
  },
  availableColors: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sizes: {
    type: Array,
    required: true,
  },
  additional_info: {
    type: String,
  },
  images: {
    type: Array,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
});
itemSchema.index({ '$**': 'text' });
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
