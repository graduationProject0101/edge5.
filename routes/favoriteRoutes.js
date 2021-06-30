const express = require('express');
const router = express.Router();
const favoriteController = require('./../controllers/favoriteController');

router
  .route('/')
  .post(favoriteController.likedItem)
  .get(favoriteController.getLikedItems)
  .delete(favoriteController.deleteLikedItem);

module.exports = router;
