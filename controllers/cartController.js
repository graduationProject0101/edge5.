const Cart = require('./../models/cartModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const akin = require('@asymmetrik/akin');

exports.createCartItem = catchAsync(async (req, res) => {
  let flag = true;
  const cartCheck = await Cart.find({
    owner: { $exists: true, $in: [req.body.owner] },
  });
  if (cartCheck.length == 0) {
    flag = false;
  }
  if (flag) {
    console.log('msc');
    let updateCart = await Cart.findOneAndUpdate(
      { owner: req.body.owner },
      { $push: { items: req.body.items } }
    );
    res.status(200).json({
      status: 'success',
      data: {
        item: updateCart,
      },
    });

    akin.activity.log(
      req.body.owner,
      req.body.items[0].itemId,
      req.body.items[0].SubCategory,
      'cart'
    );
    akin.run();
  } else {
    const newCartItem = await Cart.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        item: newCartItem,
      },
    });
    akin.activity.log(req.body.owner, req.body.items[0].itemId, 'cart');
    akin.run();
  }
});

exports.getCart = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Cart.findOne(), req.query).filter();
  const cart = await features.query;
  const len = cart[0].items.length;
  //const cart = await Cart.findOne({ owner: req.params.owner });
  if (cart) {
    let totalPrice = 0;
    for (let i = 0; i < len; i++) {
      totalPrice += cart[0].items[i].price * cart[0].items[i].qty;
    }

    res.status(200).json({
      status: 'success',
      data: {
        totalPrice: totalPrice,
        items: cart[0].items,
      },
    });
  } else {
    return next(new AppError('this user has an empty cart', 404));
  }
});

exports.getQuantity = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Cart.find(), req.query).filter();
  const cart = await features.query;
  //const cart = await Cart.findOne({ owner: req.body.owner });

  if (cart) {
    const qty = cart[0].items.length;
    res.status(200).json({
      status: 'success',
      quantity: qty,
    });
  } else {
    return next(new AppError('this user has an empty cart'));
  }
});

exports.deleteCartItem = catchAsync(async (req, res) => {
  let updateCart = await Cart.findOneAndUpdate(
    { owner: req.body.owner },
    { $pull: { items: { itemId: req.body.itemId } } }
  );

  res.status(204).json({
    status: 'success',
    data: updateCart,
  });
});
