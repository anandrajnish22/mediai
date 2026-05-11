import { useState } from 'react';
import { FaStethoscope, FaBrain, FaExclamationTriangle } from 'react-icons/fa';
import { FiSearch, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../../services/api';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ALL_SYMPTOMS = [
  'fever', 'cough', 'headache', 'fatigue', 'body ache', 'sore throat', 'runny nose', 'sneezing',
  'chest pain', 'shortness of breath', 'nausea', 'vomiting', 'diarrhea', 'stomach pain', 'dizziness',
  'joint pain', 'muscle pain', 'rash', 'itchy eyes', 'blurred vision', 'high fever', 'chills',
  'wheezing', 'difficulty breathing', 'frequent urination', 'increased thirst', 'weight loss',
  'loss of appetite', 'bloating', 'burning urination', 'red eyes', 'sensitivity to light',
  'chest tightness', 'mucus', 'slow wound healing', 'pale skin', 'cold hands', 'swollen eyelids',
  'eye discharge', 'watery eyes', 'nasal congestion', 'indigestion', 'severe headache', 'visual disturbances',
  'weakness', 'lower abdominal pain', 'cloudy urine', 'chest discomfort', 'mild fever'
];

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState('moderate');
  const [duration, setDuration] = useState('');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const filtered = ALL_SYMPTOMS.filter(s => s.includes(search.toLowerCase()) && !selectedSymptoms.includes(s));

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]);
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length < 2) return toast.error('Select at least 2 symptoms');
    setLoading(true);
    try {
      const res = await api.post('/predictions', {
        type: 'symptom_check',
        inputData: { symptoms: selectedSymptoms, severity, duration }
      });
      setResults(res.data.data.results);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error('Prediction failed. Using demo data.');
      // Fallback demo results
      setResults({
        predictions: [
          { disease: 'Common Flu', probability: 72, confidence: 85, severity: 'moderate' },
          { disease: 'Viral Infection', probability: 58, confidence: 78, severity: 'low' },
          { disease: 'Allergic Reaction', probability: 35, confidence: 70, severity: 'low' }
        ],
        riskLevel: 'moderate', riskPercentage: 45,
        recommendations: ['Consult a doctor', 'Stay hydrated', 'Rest adequately'],
        suggestedSpecialist: 'General Physician', urgencyLevel: 'soon',
        preventionTips: ['Wash hands', 'Balanced diet', 'Regular exercise']
      });
    } finally { setLoading(false); }
  };

  const chartData = results ? {
    labels: results.predictions.map(p => p.disease),
    datasets: [{
      label: 'Probability %',
      data: results.predictions.map(p => p.probability),
      backgroundColor: ['rgba(59,130,246,0.8)', 'rgba(139,92,246,0.8)', 'rgba(34,197,94,0.8)', 'rgba(249,115,22,0.8)', 'rgba(236,72,153,0.8)'],
      borderRadius: 8,
    }]
  } : null;

  const urgencyColors = { 'non-urgent': 'badge-success', 'soon': 'badge-info', 'urgent': 'badge-warning', 'emergency': 'badge-danger' };
  const riskColors = { low: 'text-green-500', moderate: 'text-yellow-500', high: 'text-orange-500', critical: 'text-red-500' };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><FaStethoscope className="text-primary-500" /> AI Symptom Checker</h1>
        <p className="text-surface-500 mt-1">Select your symptoms and let AI analyze potential conditions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Symptom Search & Selection */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">Select Symptoms</h3>
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search symptoms..." />
            </div>

            {/* Selected */}
            {selectedSymptoms.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-surface-500 mb-2">Selected ({selectedSymptoms.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map(s => (
                    <button key={s} onClick={() => toggleSymptom(s)}
                      className="px-3 py-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium hover:bg-primary-200 transition-all">
                      {s} ✕
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Available */}
            <div className="max-h-48 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {filtered.slice(0, 20).map(s => (
                  <button key={s} onClick={() => toggleSymptom(s)}
                    className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-700 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Severity & Duration */}
          <div className="glass-card p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Severity</label>
                <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="input-field">
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field" placeholder="e.g., 3 days" />
              </div>
            </div>

            <button onClick={handlePredict} disabled={loading || selectedSymptoms.length < 2}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FaBrain /> Analyze Symptoms</>}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {results ? (
            <>
              {/* Risk Overview */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">AI Analysis Results</h3>
                  <span className={urgencyColors[results.urgencyLevel]}>{results.urgencyLevel}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50 text-center">
                    <p className={`text-3xl font-bold ${riskColors[results.riskLevel]}`}>{results.riskPercentage}%</p>
                    <p className="text-xs text-surface-500 mt-1">Risk Level: {results.riskLevel}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50 text-center">
                    <p className="text-lg font-bold text-primary-600">{results.suggestedSpecialist}</p>
                    <p className="text-xs text-surface-500 mt-1">Suggested Specialist</p>
                  </div>
                </div>
                {chartData && <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }} />}
              </div>

              {/* Predictions List */}
              <div className="glass-card p-6">
                <h3 className="font-bold mb-4">Possible Conditions</h3>
                <div className="space-y-3">
                  {results.predictions.map((p, i) => (
                    <div key={i} className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{p.disease}</span>
                        <span className={`badge ${p.severity === 'high' || p.severity === 'critical' ? 'badge-danger' : p.severity === 'moderate' ? 'badge-warning' : 'badge-success'}`}>{p.severity}</span>
                      </div>
                      <div className="h-2 bg-surface-200 dark:bg-surface-600 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-medical transition-all duration-700" style={{ width: `${p.probability}%` }} />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-surface-500">
                        <span>Probability: {p.probability}%</span><span>Confidence: {p.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="glass-card p-6">
                <h3 className="font-bold mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {results.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" /><span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card p-12 text-center">
              <FaBrain className="text-6xl text-surface-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Ready to Analyze</h3>
              <p className="text-surface-500">Select your symptoms and click "Analyze" to get AI-powered predictions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
