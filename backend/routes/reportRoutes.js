const express = require('express');
const router = express.Router();
const { uploadReport, getReports, getReport, deleteReport, shareReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getReports).post(uploadReport);
router.route('/:id').get(getReport).delete(deleteReport);
router.put('/:id/share', shareReport);

module.exports = router;
