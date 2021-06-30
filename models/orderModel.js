const mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectID, ref: 'User', required: true },
  orders: { type: Array, required: true },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
