const express = require('express');
// const Item = require('../models/itemModel');
const router = express.Router();
const authController = require('./../controllers/authController');

const itemController = require('./../controllers/itemController');

// Configuring the url and calling the right http method from the itemController module
router
  .route('/sales')
  .get(itemController.aliasSales, itemController.getAllItems);

router.route('/item-stats').get(itemController.getItemStats);

router
  .route('/')
  .get(itemController.getAllItems)
  .post(itemController.createItem);

router.route('/filter').post(itemController.filterItems);

router.route('/paginate').get(itemController.paginateItems);

router
  .route('/:id')
  .get(itemController.getItem)
  .patch(itemController.updateItem)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    itemController.deleteItem
  );

module.exports = router;
