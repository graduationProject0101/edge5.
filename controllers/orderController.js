const Order = require('./../models/orderModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const akin = require('@asymmetrik/akin');

exports.postOrder = catchAsync(async (req, res, next) => {
  const newOrderItem = await Order.create(req.body);
  if (newOrderItem) {
    res.status(200).json({
      status: 'success',
      data: {
        newOrderItem,
      },
    });
    for (let i = 0; i < req.body.items.length; i++) {
      akin.activity.log(
        req.body.owner,
        req.body.items[i].itemId,
        req.body.items[i].SubCategory,
        'buy'
      );
      akin.run;
    }
  } else {
    return next(new AppError('the cart has no items in it', '400'));
  }
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({ owner: req.body.owner });
  if (order) {
    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });
  } else {
    return next(new AppError('this user did not make any orders', '400'));
  }
});
