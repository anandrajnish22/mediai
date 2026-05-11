const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, updateUser, deleteUser, getDoctors, approveDoctor, rejectDoctor, suspendDoctor } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.route('/users/:id').put(updateUser).delete(deleteUser);

// Doctor approval management
router.get('/doctors', getDoctors);
router.put('/doctors/:id/approve', approveDoctor);
router.put('/doctors/:id/reject', rejectDoctor);
router.put('/doctors/:id/suspend', suspendDoctor);

module.exports = router;
