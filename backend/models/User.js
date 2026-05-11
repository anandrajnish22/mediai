const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'approved'
  },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''], default: '' },
  weight: { type: Number },
  height: { type: Number },
  allergies: [{ type: String }],
  medicalHistory: [{ type: String }],
  emergencyContacts: [{
    name: String,
    phone: String,
    relation: String
  }],
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    country: { type: String, default: 'India' }
  },
  // Doctor-specific fields
  specialization: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  qualifications: [{ type: String }],
  medicalLicense: { type: String, default: '' },
  hospitalName: { type: String, default: '' },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  consultationFee: { type: Number, default: 0 },
  availableSlots: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: String,
    endTime: String
  }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // Health metrics for patients
  healthScore: { type: Number, default: 75 },
  bmi: { type: Number },
  // Medicine reminders
  medicineReminders: [{
    medicineName: String,
    dosage: String,
    frequency: String,
    time: [String],
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true }
  }],
  // Notification preferences
  notificationPreferences: {
    email: { type: Boolean, default: true },
    browser: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  darkMode: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate BMI
userSchema.methods.calculateBMI = function() {
  if (this.weight && this.height) {
    const heightInMeters = this.height / 100;
    this.bmi = parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
    return this.bmi;
  }
  return null;
};

module.exports = mongoose.model('User', userSchema);
