const Item = require('./../models/itemModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// aliasing but not yet uset //TODO:
exports.aliasSales = (req, res, next) => {
  req.query.sort = 'discount';
  next();
};

exports.getAllItems = catchAsync(async (req, res, next) => {
  // Execute the query after creating it in the above lines
  const features = new APIFeatures(Item.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const items = await features.query;
  ~(
    // Send responce
    res.status(200).json({
      status: 'success',
      results: items.length,
      data: {
        items,
      },
    })
  );
});

exports.getItem = catchAsync(async (req, res, next) => {
  // console.log(req.params.id);
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new AppError('No item found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      item,
    },
  });
});

exports.createItem = catchAsync(async (req, res, next) => {
  const newItem = await Item.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      item: newItem,
    },
  });
});

exports.updateItem = catchAsync(async (req, res, next) => {
  // TODO: FIX
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // the new updated document is the one to be returend
    runValidators: true,
  });

  if (!item) {
    return next(new AppError('No item found with that ID', 404));
  }
  // console.log(item);
  res.status(200).json({
    status: 'success',
    data: {
      item,
    },
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) {
    return next(new AppError('No item found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// aggregation pipeline
exports.getItemStats = catchAsync(async (req, res, next) => {
  const stats = await Item.aggregate([
    {
      $match: { price: { $gte: 100 } },
    },
    {
      $group: {
        _id: '$category', // for Men AND Women
        numItems: { $sum: 1 }, // calculate number of items
        avgPrice: { $avg: '$price' }, // calculate average items price
        minPrice: { $min: '$price' }, // calculate minimum items price
        maxPrice: { $max: '$price' }, // calculate maximum items price
      },
    },
    {
      $sort: { avgPrice: 1 }, // 1 for ascending order
    },
    // {
    //   $match: {_id: { $ne:}}
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
