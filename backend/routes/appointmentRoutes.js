const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, getAppointment, updateAppointment, cancelAppointment, getAppointmentStats } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/stats', getAppointmentStats);
router.route('/').get(getAppointments).post(authorize('patient'), createAppointment);
router.route('/:id').get(getAppointment).put(authorize('doctor', 'admin'), updateAppointment);
router.put('/:id/cancel', cancelAppointment);

module.exports = router;
