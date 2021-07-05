const Item = require('./../models/itemModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const akin = require('@asymmetrik/akin');

exports.getRecommendations = catchAsync(async (req, res) => {
  let recommendedList = [];
  const sampledRecommendations =
    await akin.recommendation.sampleRecommendationsForUser(
      req.body.owner,
      req.body.samples
    );

  if (!sampledRecommendations) {
    return new AppError('No recommendations for this user yet', 404);
  }

  for (let i = 0; i < sampledRecommendations.length; i++) {
    const recommendedItems = await Item.findById(
      sampledRecommendations[i].item
    );
    recommendedList.push(recommendedItems);
  }

  res.status(200).json({
    status: 'success',
    length: sampledRecommendations.length,
    recommendations: recommendedList,
  });
});
