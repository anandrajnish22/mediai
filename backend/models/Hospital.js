const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String },
    country: { type: String, default: 'India' }
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  departments: [{ type: String }],
  facilities: [{ type: String }],
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  images: [{ type: String }],
  isEmergencyAvailable: { type: Boolean, default: true },
  isOpen24Hours: { type: Boolean, default: false },
  operatingHours: {
    open: { type: String, default: '08:00' },
    close: { type: String, default: '20:00' }
  },
  bedCapacity: { type: Number, default: 0 },
  availableBeds: { type: Number, default: 0 },
  ambulanceAvailable: { type: Boolean, default: true },
  website: { type: String, default: '' },
  description: { type: String, default: '' },
  specialties: [{ type: String }],
  insuranceAccepted: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ 'address.city': 1 });
hospitalSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Hospital', hospitalSchema);
