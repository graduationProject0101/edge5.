const mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectID, ref: 'User', required: true },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        ref: 'Product',
      },
      itemName: { type: String },
      qty: { type: Number, default: 1 },
      price: { type: Number, default: 0 },
      images: { type: String },
      color: { type: String },
      size: { type: String },
      seller: { type: String },
      SubCategory: { type: String },
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
