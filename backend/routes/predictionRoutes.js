const express = require('express');
const router = express.Router();
const { createPrediction, getPredictions, getPrediction } = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getPredictions).post(createPrediction);
router.get('/:id', getPrediction);

module.exports = router;
