const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['symptom_check', 'diabetes', 'heart_disease', 'bmi', 'stress', 'general'],
    required: true
  },
  inputData: {
    symptoms: [{ type: String }],
    severity: { type: String, enum: ['mild', 'moderate', 'severe', ''], default: '' },
    duration: { type: String, default: '' },
    age: Number,
    weight: Number,
    height: Number,
    bloodPressure: { systolic: Number, diastolic: Number },
    sugarLevel: Number,
    cholesterol: Number,
    heartRate: Number,
    lifestyle: {
      smoking: { type: Boolean, default: false },
      alcohol: { type: Boolean, default: false },
      exercise: { type: String, enum: ['none', 'light', 'moderate', 'heavy', ''], default: '' },
      diet: { type: String, default: '' },
      sleepHours: Number,
      stressLevel: { type: Number, min: 1, max: 10 }
    }
  },
  results: {
    predictions: [{
      disease: String,
      probability: Number,
      confidence: Number,
      severity: { type: String, enum: ['low', 'moderate', 'high', 'critical'] }
    }],
    riskLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      default: 'low'
    },
    riskPercentage: { type: Number, default: 0 },
    recommendations: [{ type: String }],
    suggestedSpecialist: { type: String, default: '' },
    urgencyLevel: {
      type: String,
      enum: ['non-urgent', 'soon', 'urgent', 'emergency'],
      default: 'non-urgent'
    },
    preventionTips: [{ type: String }]
  },
  modelUsed: { type: String, default: 'random_forest' },
  accuracy: { type: Number },
  isReviewed: { type: Boolean, default: false },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

predictionSchema.index({ user: 1, createdAt: -1 });
predictionSchema.index({ type: 1 });

module.exports = mongoose.model('Prediction', predictionSchema);
