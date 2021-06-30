const express = require('express');
const router = express.Router();
const orderController = require('./../controllers/orderController');

router.route('/checkout').post(orderController.postOrder);

router.route('/getorder').get(orderController.getOrder);

module.exports = router;
