const Cart = require('./../models/cartModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const akin = require('@asymmetrik/akin');

exports.createCartItem = catchAsync(async (req, res) => {
  // let cart = await Cart.find({ owner: req.body.owner });
  // //console.log(req.body.items[0]['itemdId'].toString());
  // for (let i = 0; i < cart[0].items.length; i++) {
  //   if (req.body.items[0]['itemdId'] == cart[0].items[i].itemId.toString()) {
  //     let updateQty = await Cart.findOneAndUpdate(
  //       { owner: req.body.owner, items: req.body.items[0]['itemId'] },
  //       { $set: { qty: 4 } }
  //     );
  //   }
  // }
  let updateCart = await Cart.findOneAndUpdate(
    { owner: req.body.owner },
    { $push: { items: req.body.items } }
  );

  akin.activity.log(
    req.body.owner,
    req.body.items[0].itemId,
    req.body.items[0].SubCategory,
    'cart'
  );
  akin.run();

  res.status(200).json({
    status: 'success',
    data: {
      item: updateCart,
    },
  });
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
    {
      $pull: {
        items: {
          itemId: req.body.itemId,
          color: req.body.color,
          size: req.body.size,
        },
      },
    }
  );

  res.status(204).json({
    status: 'success',
    data: updateCart,
  });
});
