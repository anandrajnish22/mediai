const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');
const Prediction = require('../models/Prediction');
const Emergency = require('../models/Emergency');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor', approvalStatus: 'approved' });
    const pendingDoctors = await User.countDocuments({ role: 'doctor', approvalStatus: 'pending' });
    const totalHospitals = await Hospital.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalPredictions = await Prediction.countDocuments();
    const activeEmergencies = await Emergency.countDocuments({ status: 'active' });
    const recentAppointments = await Appointment.find().populate('patient', 'name').populate('doctor', 'name specialization').sort({ createdAt: -1 }).limit(5);
    const monthlyUsers = await User.aggregate([
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    const diseaseStats = await Prediction.aggregate([
      { $unwind: '$results.predictions' },
      { $group: { _id: '$results.predictions.disease', count: { $sum: 1 } } },
      { $sort: { count: -1 } }, { $limit: 10 }
    ]);
    res.json({
      success: true,
      data: { totalUsers, totalDoctors, pendingDoctors, totalHospitals, totalAppointments, totalPredictions, activeEmergencies, recentAppointments, monthlyUsers, diseaseStats }
    });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.name = new RegExp(search, 'i');
    const users = await User.find(query).select('-password').skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 });
    const total = await User.countDocuments(query);
    res.json({ success: true, data: users, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ============ DOCTOR APPROVAL SYSTEM ============

// @desc    Get doctors by approval status
// @route   GET /api/admin/doctors?status=pending|approved|rejected|suspended
const getDoctors = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = { role: 'doctor' };
    if (status) query.approvalStatus = status;
    if (search) query.name = new RegExp(search, 'i');

    const doctors = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);
    const pendingCount = await User.countDocuments({ role: 'doctor', approvalStatus: 'pending' });
    const approvedCount = await User.countDocuments({ role: 'doctor', approvalStatus: 'approved' });
    const rejectedCount = await User.countDocuments({ role: 'doctor', approvalStatus: 'rejected' });
    const suspendedCount = await User.countDocuments({ role: 'doctor', approvalStatus: 'suspended' });

    res.json({
      success: true,
      data: doctors,
      counts: { pending: pendingCount, approved: approvedCount, rejected: rejectedCount, suspended: suspendedCount },
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Approve a doctor
// @route   PUT /api/admin/doctors/:id/approve
const approveDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    if (doctor.role !== 'doctor') return res.status(400).json({ success: false, message: 'User is not a doctor' });

    doctor.approvalStatus = 'approved';
    doctor.isVerified = true;
    await doctor.save({ validateBeforeSave: false });

    res.json({ success: true, message: `Dr. ${doctor.name} has been approved successfully`, data: doctor });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Reject a doctor
// @route   PUT /api/admin/doctors/:id/reject
const rejectDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    if (doctor.role !== 'doctor') return res.status(400).json({ success: false, message: 'User is not a doctor' });

    doctor.approvalStatus = 'rejected';
    await doctor.save({ validateBeforeSave: false });

    res.json({ success: true, message: `Dr. ${doctor.name} has been rejected`, data: doctor });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Suspend a doctor
// @route   PUT /api/admin/doctors/:id/suspend
const suspendDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    if (doctor.role !== 'doctor') return res.status(400).json({ success: false, message: 'User is not a doctor' });

    doctor.approvalStatus = 'suspended';
    await doctor.save({ validateBeforeSave: false });

    res.json({ success: true, message: `Dr. ${doctor.name} has been suspended`, data: doctor });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { getDashboardStats, getAllUsers, updateUser, deleteUser, getDoctors, approveDoctor, rejectDoctor, suspendDoctor };
