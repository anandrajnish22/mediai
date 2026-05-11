const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Report title is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['blood_test', 'xray', 'mri', 'ct_scan', 'prescription', 'discharge_summary', 'lab_report', 'other'],
    default: 'other'
  },
  description: { type: String, default: '' },
  fileUrl: { type: String, required: true },
  fileType: { type: String, default: 'pdf' },
  fileSize: { type: Number },
  analysisResult: {
    extractedText: { type: String, default: '' },
    abnormalValues: [{ 
      parameter: String,
      value: String,
      normalRange: String,
      status: { type: String, enum: ['normal', 'high', 'low', 'critical'] }
    }],
    riskWarnings: [{ type: String }],
    aiSummary: { type: String, default: '' }
  },
  tags: [{ type: String }],
  isSharedWithDoctor: { type: Boolean, default: false },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

medicalReportSchema.index({ patient: 1, createdAt: -1 });
medicalReportSchema.index({ category: 1 });

module.exports = mongoose.model('MedicalReport', medicalReportSchema);
