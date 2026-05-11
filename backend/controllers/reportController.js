const MedicalReport = require('../models/MedicalReport');

const uploadReport = async (req, res) => {
  try {
    const { title, category, description, fileUrl, fileType, fileSize, tags } = req.body;
    const report = await MedicalReport.create({
      patient: req.user._id, title, category: category || 'other',
      description: description || '', fileUrl, fileType: fileType || 'pdf', fileSize, tags: tags || []
    });
    res.status(201).json({ success: true, message: 'Report uploaded', data: report });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const getReports = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = {};
    if (req.user.role === 'patient') query.patient = req.user._id;
    else if (req.user.role === 'doctor') query.sharedWith = req.user._id;
    if (category) query.category = category;
    const reports = await MedicalReport.find(query)
      .populate('patient', 'name email avatar').populate('doctor', 'name specialization')
      .skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 });
    const total = await MedicalReport.countDocuments(query);
    res.json({ success: true, data: reports, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const getReport = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id).populate('patient', 'name email').populate('doctor', 'name');
    if (!report) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: report });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const deleteReport = async (req, res) => {
  try {
    const report = await MedicalReport.findOneAndDelete({ _id: req.params.id, patient: req.user._id });
    if (!report) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Report deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const shareReport = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Not found' });
    if (!report.sharedWith.includes(req.body.doctorId)) {
      report.sharedWith.push(req.body.doctorId);
      report.isSharedWithDoctor = true;
      await report.save();
    }
    res.json({ success: true, message: 'Report shared', data: report });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { uploadReport, getReports, getReport, deleteReport, shareReport };
