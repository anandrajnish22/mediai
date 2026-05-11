const express = require('express');
const router = express.Router();
const { createEmergency, getEmergencies, updateEmergency } = require('../controllers/emergencyController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getEmergencies).post(createEmergency);
router.put('/:id', authorize('admin'), updateEmergency);

module.exports = router;
