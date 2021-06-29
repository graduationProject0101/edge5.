const express = require('express');
const router = express.Router();

const cartController = require('./../controllers/cartController');

router
  .route('/')
  .post(cartController.createCartItem)
  .delete(cartController.deleteCartItem);

router.route('/getcart').get(cartController.getCart);

router.route('/qty').get(cartController.getQuantity);

module.exports = router;
