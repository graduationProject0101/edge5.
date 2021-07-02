const Item = require('./../models/itemModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const akin = require('@asymmetrik/akin');

exports.getRecommendations = catchAsync(async (req, res) => {
  const recommendations =
    await akin.recommendation.getAllRecommendationsForUser(req.body.owner);
  res.status(200).json({
    status: 'success',
    recommendations: recommendations,
  });
  if(!recommendations){
    return new AppError('No recommendations for this user yet' , 404);
  }
});
