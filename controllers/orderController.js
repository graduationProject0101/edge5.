const Order = require('./../models/orderModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const akin = require('@asymmetrik/akin');
const Cart = require('./../models/cartModel');

exports.postOrder = catchAsync(async (req, res, next) => {
  let flag = true;
  const orderCheck = await Order.find({
    owner: { $exists: true, $in: [req.body.owner] },
  });
  if (orderCheck.length == 0) {
    flag = false;
  }

  if (flag) {
    let updateOrder = await Order.findOneAndUpdate(
      { owner: req.body.owner },
      { $push: { orders: req.body.orders } }
    );
    res.status(200).json({
      status: 'success',
      data: {
        updateOrder,
      },
    });
  } else if (!flag) {
    const newOrderItem = await Order.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        newOrderItem,
      },
    });
  } else {
    return next(new AppError('the cart has no items in it', '400'));
  }
  const len = req.body.orders.length - 1;
  for (let i = 0; i < req.body.orders[len].order.length; i++) {
    akin.activity.log(
      req.body.owner,
      req.body.orders[len].order[i].itemId,
      req.body.orders[len].order[i].SubCategory,
      'buy'
    );
    akin.run();
  }
  //deleting items in cart wehn making an order
  let deleteCartItems = await Cart.findOne({ owner: req.body.owner });
  for (let i = 0; i < deleteCartItems.items.length; i++) {
    let deleteItems = await Cart.findOneAndUpdate(
      { owner: req.body.owner },
      { $pop: { items: 1 } }
    );
  }
});
exports.getOrder = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Order.findOne(), req.query).filter();

  const order = await features.query;
  //const order = await Order.findOne({ owner: req.body.owner });
  if (order) {
    res.status(200).json({
      status: 'success',
      data: order,
    });
  } else {
    return next(new AppError('this user did not make any orders', '400'));
  }
});

exports.getAllOrders = catchAsync(async (req, res) => {
  const allOrders = await Order.find();
  res.status(200).json({
    status: 'success',
    orders: allOrders.length,
    data: {
      allOrders,
    },
  });
});
