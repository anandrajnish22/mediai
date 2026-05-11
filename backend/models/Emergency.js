const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  address: { type: String, default: '' },
  emergencyType: {
    type: String,
    enum: ['medical', 'accident', 'cardiac', 'breathing', 'other'],
    default: 'medical'
  },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['active', 'responding', 'resolved', 'cancelled'],
    default: 'active'
  },
  nearbyHospitals: [{
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    distance: Number,
    notified: { type: Boolean, default: false }
  }],
  contactsNotified: [{
    name: String,
    phone: String,
    notifiedAt: Date
  }],
  respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  resolvedAt: { type: Date }
}, {
  timestamps: true
});

emergencySchema.index({ location: '2dsphere' });
emergencySchema.index({ status: 1 });

module.exports = mongoose.model('Emergency', emergencySchema);
