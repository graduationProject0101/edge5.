const Cart = require('./../models/cartModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const akin = require('@asymmetrik/akin');
const Favorite = require('./../models/favoriteModel');

exports.likedItem = catchAsync(async (req, res, next) => {
  let flag = true;
  const listCheck = await Favorite.find({
    owner: { $exists: true, $in: [req.body.owner] },
  });
  if (listCheck.length == 0) {
    flag = false;
  }
  if (flag) {
    let updateList = await Favorite.findOneAndUpdate(
      { owner: req.body.owner },
      { $push: { items: req.body.items } }
    );
    res.status(200).json({
      status: 'success',
      data: {
        item: updateList,
      },
    });

    akin.activity.log(
      req.body.owner,
      req.body.items[0].itemId,
      req.body.items[0].SubCategory,
      'favorite'
    );
    akin.run();
  }
});

exports.getLikedItems = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Favorite.findOne(), req.query).filter();
  const favoriteList = await features.query;
  //const cart = await Cart.findOne({ owner: req.params.owner });
  res.status(200).json({
    status: 'success',
    data: {
      items: favoriteList[0].items,
    },
  });
});

exports.deleteLikedItem = catchAsync(async (req, res, next) => {
  console.log('sdsd');
  let deleteItem = await Favorite.findOneAndUpdate(
    { owner: req.body.owner },
    { $pull: { items: { itemId: req.body.itemId } } }
  );

  res.status(204).json({
    status: 'success',
    data: deleteItem,
  });
});
