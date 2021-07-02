const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // Send responce
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
exports.getUser = catchAsync(async (req, res) => {
  const features = new APIFeatures (User.find() , req.query).filter();
  const user = await features.query;
  if(!user){
    return next(new AppError('User not found' , 404));
  }else{
    res.status(200).json({
      status: 'success',
      data:user,
    });
  }

});
