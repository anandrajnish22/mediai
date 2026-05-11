const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword, getDoctors } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.get('/doctors', getDoctors);

module.exports = router;
