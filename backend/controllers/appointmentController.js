const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create appointment
// @route   POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const { doctor, hospital, date, timeSlot, type, symptoms, notes } = req.body;

    // Check if doctor exists
    const doctorUser = await User.findOne({ _id: doctor, role: 'doctor' });
    if (!doctorUser) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Check for conflicting appointments
    const existing = await Appointment.findOne({
      doctor, date, timeSlot, status: { $nin: ['cancelled'] }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor, hospital, date, timeSlot,
      type: type || 'general',
      symptoms: symptoms || [],
      notes: notes || '',
      fee: doctorUser.consultationFee || 0
    });

    // Create notification for doctor
    await Notification.create({
      user: doctor,
      title: 'New Appointment',
      message: `${req.user.name} has booked an appointment for ${new Date(date).toLocaleDateString()} at ${timeSlot}`,
      type: 'appointment',
      link: `/doctor/appointments/${appointment._id}`
    });

    const populated = await appointment.populate([
      { path: 'doctor', select: 'name specialization avatar' },
      { path: 'hospital', select: 'name address' }
    ]);

    res.status(201).json({ success: true, message: 'Appointment booked successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments
const getAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role === 'patient') query.patient = req.user._id;
    else if (req.user.role === 'doctor') query.doctor = req.user._id;

    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone avatar')
      .populate('doctor', 'name specialization avatar consultationFee')
      .populate('hospital', 'name address')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: appointments,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone avatar bloodGroup allergies')
      .populate('doctor', 'name specialization avatar consultationFee qualifications')
      .populate('hospital', 'name address phone');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment (doctor)
// @route   PUT /api/appointments/:id
const updateAppointment = async (req, res) => {
  try {
    const { status, diagnosis, prescription, followUpDate, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (status) appointment.status = status;
    if (diagnosis) appointment.diagnosis = diagnosis;
    if (prescription) appointment.prescription = prescription;
    if (followUpDate) appointment.followUpDate = followUpDate;
    if (notes) appointment.notes = notes;

    await appointment.save();

    // Notify patient of status change
    if (status) {
      await Notification.create({
        user: appointment.patient,
        title: 'Appointment Updated',
        message: `Your appointment status has been updated to: ${status}`,
        type: 'appointment',
        link: `/patient/appointments/${appointment._id}`
      });
    }

    res.json({ success: true, message: 'Appointment updated', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    appointment.cancelReason = req.body.reason || '';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get appointment stats
// @route   GET /api/appointments/stats
const getAppointmentStats = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'patient') query.patient = req.user._id;
    else if (req.user.role === 'doctor') query.doctor = req.user._id;

    const total = await Appointment.countDocuments(query);
    const pending = await Appointment.countDocuments({ ...query, status: 'pending' });
    const confirmed = await Appointment.countDocuments({ ...query, status: 'confirmed' });
    const completed = await Appointment.countDocuments({ ...query, status: 'completed' });
    const cancelled = await Appointment.countDocuments({ ...query, status: 'cancelled' });

    // Monthly stats for charts
    const monthlyStats = await Appointment.aggregate([
      { $match: query },
      { $group: { _id: { $month: '$date' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: { total, pending, confirmed, completed, cancelled, monthlyStats }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createAppointment, getAppointments, getAppointment, updateAppointment, cancelAppointment, getAppointmentStats };
