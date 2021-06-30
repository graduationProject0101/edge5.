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
      images: { type: String },
      color: { type: String },
      size: { type: String },
      seller: { type: String },
      SubCategory: { type: String },
    },
  ],
});

const favorite = mongoose.model('favorite', favoriteSchema);

module.exports = favorite;
