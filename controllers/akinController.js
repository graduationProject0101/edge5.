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

  if (sampledRecommendations.length == 0) {
    const Items = await Item.find();
    const randomItems = getRandom(Items, req.body.samples);
    res.status(200).json({
      status: 'success',
      items: randomItems,
    });
  } else {
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
  }
});

//to get random items if the user did not make any activities
function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available');
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}
