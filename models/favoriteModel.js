const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectID, ref: 'User', required: true },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        ref: 'Product',
      },
      itemName: { type: String },
      images: { type: Array },
      color: { type: Array },
      size: { type: Array },
      seller: { type: String },
      SubCategory: { type: String },
      price:{type:Number}
    },
  ],
});

const favorite = mongoose.model('favorite', favoriteSchema);

module.exports = favorite;
