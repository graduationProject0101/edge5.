const express = require('express');
const router = express.Router();

const cartController = require('./../controllers/cartController');

router
  .route('/')
  .post(cartController.createCartItem)
  .delete(cartController.deleteCartItem);

router.route('/getcart').post(cartController.getCart);

router.route('/qty').post(cartController.getQuantity);

module.exports = router;
