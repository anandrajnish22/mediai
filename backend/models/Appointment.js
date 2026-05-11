const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required']
  },
  type: {
    type: String,
    enum: ['general', 'specialist', 'follow-up', 'emergency'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  symptoms: [{ type: String }],
  notes: { type: String, default: '' },
  diagnosis: { type: String, default: '' },
  prescription: { type: String, default: '' },
  followUpDate: { type: Date },
  fee: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  cancelReason: { type: String, default: '' },
  rating: { type: Number, min: 0, max: 5 },
  review: { type: String, default: '' }
}, {
  timestamps: true
});

appointmentSchema.index({ patient: 1, date: -1 });
appointmentSchema.index({ doctor: 1, date: -1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
