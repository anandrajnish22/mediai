const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, specialization, experience, qualifications, medicalLicense, hospitalName } = req.body;

    // Prevent admin registration from frontend
    if (role === 'admin') {
      return res.status(403).json({ success: false, message: 'Admin accounts cannot be created through registration' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const userData = { name, email, password, role: role || 'patient', phone };

    // Set approval status based on role
    if (role === 'doctor') {
      userData.approvalStatus = 'pending';
      userData.specialization = specialization || '';
      userData.experience = experience || 0;
      userData.qualifications = qualifications || [];
      userData.medicalLicense = medicalLicense || '';
      userData.hospitalName = hospitalName || '';
    } else {
      userData.approvalStatus = 'approved';
    }

    const user = await User.create(userData);

    // For doctors, don't return a token (they can't access until approved)
    if (user.role === 'doctor') {
      return res.status(201).json({
        success: true,
        message: 'Your doctor account request has been submitted and is waiting for admin approval.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          approvalStatus: user.approvalStatus
        }
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check doctor approval status
    if (user.role === 'doctor') {
      if (user.approvalStatus === 'pending') {
        return res.status(403).json({
          success: false,
          message: 'Your doctor account is waiting for admin approval. Please check back later.',
          approvalStatus: 'pending'
        });
      }
      if (user.approvalStatus === 'rejected') {
        return res.status(403).json({
          success: false,
          message: 'Your doctor account request was rejected. Please contact support for more information.',
          approvalStatus: 'rejected'
        });
      }
      if (user.approvalStatus === 'suspended') {
        return res.status(403).json({
          success: false,
          message: 'Your doctor account has been suspended. Please contact support.',
          approvalStatus: 'suspended'
        });
      }
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        avatar: user.avatar,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('hospital');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'phone', 'dateOfBirth', 'gender', 'bloodGroup',
      'weight', 'height', 'allergies', 'medicalHistory', 'address',
      'emergencyContacts', 'avatar', 'specialization', 'experience',
      'qualifications', 'consultationFee', 'availableSlots',
      'notificationPreferences', 'darkMode'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true, runValidators: true
    });

    // Recalculate BMI if weight or height changed
    if (updateData.weight || updateData.height) {
      user.calculateBMI();
      await user.save({ validateBeforeSave: false });
    }

    res.json({ success: true, message: 'Profile updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, message: 'Password changed successfully', data: { token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/auth/doctors
const getDoctors = async (req, res) => {
  try {
    const { specialization, search, page = 1, limit = 10 } = req.query;
    const query = { role: 'doctor', isActive: true };

    if (specialization) query.specialization = new RegExp(specialization, 'i');
    if (search) query.name = new RegExp(search, 'i');

    const doctors = await User.find(query)
      .select('-password -medicalHistory -allergies -medicineReminders')
      .populate('hospital', 'name address')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ rating: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: doctors,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword, getDoctors };
