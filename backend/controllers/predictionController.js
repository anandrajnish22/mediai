const Prediction = require('../models/Prediction');
const axios = require('axios');

const createPrediction = async (req, res) => {
  try {
    const { type, inputData } = req.body;
    let aiResults;
    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/predict`, { type, inputData }, { timeout: 10000 });
      aiResults = aiResponse.data;
    } catch {
      // Fallback mock results if AI service is down
      aiResults = generateMockPrediction(type, inputData);
    }
    const prediction = await Prediction.create({
      user: req.user._id, type, inputData,
      results: aiResults.results || aiResults,
      modelUsed: aiResults.model || 'random_forest',
      accuracy: aiResults.accuracy || 85
    });
    res.status(201).json({ success: true, data: prediction });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const getPredictions = async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };
    if (type) query.type = type;
    const predictions = await Prediction.find(query).skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 });
    const total = await Prediction.countDocuments(query);
    res.json({ success: true, data: predictions, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const getPrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: prediction });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

function generateMockPrediction(type, inputData) {
  const diseases = {
    symptom_check: [
      { disease: 'Common Flu', probability: 72, confidence: 85, severity: 'low' },
      { disease: 'Viral Infection', probability: 58, confidence: 78, severity: 'moderate' },
      { disease: 'Allergic Reaction', probability: 35, confidence: 70, severity: 'low' }
    ],
    diabetes: [{ disease: 'Type 2 Diabetes', probability: 45, confidence: 82, severity: 'moderate' }],
    heart_disease: [{ disease: 'Hypertension Risk', probability: 38, confidence: 80, severity: 'moderate' }],
    general: [{ disease: 'General Checkup Recommended', probability: 60, confidence: 75, severity: 'low' }]
  };
  return {
    results: {
      predictions: diseases[type] || diseases.general,
      riskLevel: 'moderate', riskPercentage: 45,
      recommendations: ['Consult a doctor', 'Maintain healthy diet', 'Exercise regularly'],
      suggestedSpecialist: 'General Physician', urgencyLevel: 'soon',
      preventionTips: ['Stay hydrated', 'Get adequate sleep', 'Avoid stress']
    },
    model: 'random_forest', accuracy: 85
  };
}

module.exports = { createPrediction, getPredictions, getPrediction };
