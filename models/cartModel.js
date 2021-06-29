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
      itemName: { type: String, required: true },
      qty: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true, default: 0 },
      images: { type: String, required: true },
      color: { type: String, required: true },
      size: { type: String, required: true },
      seller: { type: String, required: true },
      SubCategory: { type: String, required: true },
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
