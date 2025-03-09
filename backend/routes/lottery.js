const express = require('express');
const lotteryController = require('../controllers/lotteryController');

const router = express.Router();

// Get all draws history
router.get('/draws', lotteryController.getAllDraws);

// Get a specific draw result by ID
router.get('/draws/:drawId', lotteryController.getDrawById);

// Save draw data (called when a new draw is created)
router.post('/draws', lotteryController.saveDraw);

// Update draw with result (called when a draw is performed)
router.put('/draws/:drawId/result', lotteryController.updateDrawResult);

module.exports = router;
