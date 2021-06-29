const express = require('express');
const router = express.Router();

const akinController = require('../controllers/akinController');

router.route('').post(akinController.getRecommendations);

module.exports = router;
