import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeartbeat, FaUserMd, FaCheckCircle } from 'react-icons/fa';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight, FiBriefcase, FiAward, FiHash } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '',
    role: 'patient',
    // Doctor-specific
    specialization: '', experience: '', hospitalName: '', medicalLicense: ''
  });
  const [loading, setLoading] = useState(false);
  const [doctorSubmitted, setDoctorSubmitted] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');

    // Doctor field validation
    if (formData.role === 'doctor') {
      if (!formData.specialization) return toast.error('Specialization is required');
      if (!formData.medicalLicense) return toast.error('Medical License Number is required');
      if (!formData.hospitalName) return toast.error('Hospital Name is required');
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      };

      if (formData.role === 'doctor') {
        payload.specialization = formData.specialization;
        payload.experience = parseInt(formData.experience) || 0;
        payload.hospitalName = formData.hospitalName;
        payload.medicalLicense = formData.medicalLicense;
      }

      const res = await register(payload);

      if (formData.role === 'doctor') {
        // Doctor registration — show pending message
        setDoctorSubmitted(true);
      } else {
        toast.success('Account created successfully!');
        navigate('/patient');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const specializations = [
    'General Physician', 'Cardiologist', 'Neurologist', 'Orthopedic',
    'Dermatologist', 'Pediatrician', 'Psychiatrist', 'Oncologist',
    'Endocrinologist', 'Pulmonologist', 'Nephrologist', 'Ophthalmologist',
    'ENT Specialist', 'Gynecologist', 'Urologist', 'Gastroenterologist'
  ];

  // Doctor submission success screen
  if (doctorSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-surface-900 p-6">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h1 className="text-3xl font-black mb-3">Application Submitted! 🎉</h1>
          <p className="text-surface-500 mb-2 text-lg">
            Your doctor account request has been submitted and is <span className="text-yellow-500 font-semibold">waiting for admin approval</span>.
          </p>
          <p className="text-surface-400 text-sm mb-8">
            Our admin team will review your credentials and medical license. You will be able to log in once your account is approved.
          </p>
          <div className="glass-card p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2 text-sm">Application Details:</h3>
            <div className="space-y-1 text-sm text-surface-500">
              <p><span className="font-medium text-surface-700 dark:text-surface-300">Name:</span> {formData.name}</p>
              <p><span className="font-medium text-surface-700 dark:text-surface-300">Email:</span> {formData.email}</p>
              <p><span className="font-medium text-surface-700 dark:text-surface-300">Specialization:</span> {formData.specialization}</p>
              <p><span className="font-medium text-surface-700 dark:text-surface-300">License:</span> {formData.medicalLicense}</p>
              <p><span className="font-medium text-surface-700 dark:text-surface-300">Hospital:</span> {formData.hospitalName}</p>
            </div>
          </div>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2 px-8">
            Go to Login <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative text-center text-white p-12">
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-8">
            <FaHeartbeat className="text-5xl" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join MediAI Today</h2>
          <p className="text-white/70 max-w-sm mx-auto mb-6">Create your account and get access to AI-powered health predictions, symptom analysis, and more.</p>
          <div className="mt-4 space-y-3">
            {formData.role === 'patient' ? (
              ['AI Disease Prediction', 'Digital Health Records', '24/7 Emergency Support'].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80 justify-center">
                  <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center"><span className="text-green-400 text-xs">✓</span></div>
                  <span>{f}</span>
                </div>
              ))
            ) : (
              ['Manage Patient Appointments', 'Digital Prescriptions', 'Admin-Verified Profile', 'Patient Health Analytics'].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80 justify-center">
                  <div className="w-6 h-6 rounded-full bg-blue-400/20 flex items-center justify-center"><span className="text-blue-400 text-xs">✓</span></div>
                  <span>{f}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-surface-900 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in py-8">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/25">
              <FaHeartbeat className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-medical bg-clip-text text-transparent">MediAI</span>
          </Link>

          <h1 className="text-3xl font-black mb-2">Create Account</h1>
          <p className="text-surface-500 mb-5">Start your health journey with MediAI</p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Role Selection — Only Patient & Doctor */}
            <div className="grid grid-cols-2 gap-3 mb-1">
              {[
                { role: 'patient', label: 'Patient', icon: FiUser, desc: 'Health tracking & AI predictions' },
                { role: 'doctor', label: 'Doctor', icon: FaUserMd, desc: 'Requires admin approval' }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button key={item.role} type="button" onClick={() => setFormData(p => ({ ...p, role: item.role }))}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${formData.role === item.role
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-surface-200 dark:border-surface-700 hover:border-primary-300'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`text-lg ${formData.role === item.role ? 'text-primary-600' : 'text-surface-400'}`} />
                      <span className={`font-semibold text-sm ${formData.role === item.role ? 'text-primary-600' : ''}`}>{item.label}</span>
                    </div>
                    <p className="text-[11px] text-surface-500">{item.desc}</p>
                  </button>
                );
              })}
            </div>

            {formData.role === 'doctor' && (
              <div className="px-3 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-xs text-yellow-700 dark:text-yellow-400">
                ⚠️ Doctor accounts require admin verification before you can access the platform.
              </div>
            )}

            {/* Common Fields */}
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
              <input name="name" value={formData.name} onChange={handleChange} required className="input-field pl-11" placeholder="Full Name" />
            </div>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
              <input name="email" type="email" value={formData.email} onChange={handleChange} required className="input-field pl-11" placeholder="Email Address" />
            </div>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
              <input name="phone" value={formData.phone} onChange={handleChange} required className="input-field pl-11" placeholder="Phone Number" />
            </div>

            {/* Doctor-Specific Fields */}
            {formData.role === 'doctor' && (
              <div className="space-y-3.5 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
                <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Doctor Information</p>
                <div className="relative">
                  <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                  <select name="specialization" value={formData.specialization} onChange={handleChange} required className="input-field pl-11">
                    <option value="">Select Specialization</option>
                    {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <FiAward className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input name="experience" type="number" min="0" max="50" value={formData.experience} onChange={handleChange} required className="input-field pl-11" placeholder="Years of Experience" />
                </div>
                <div className="relative">
                  <FaHeartbeat className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input name="hospitalName" value={formData.hospitalName} onChange={handleChange} required className="input-field pl-11" placeholder="Hospital / Clinic Name" />
                </div>
                <div className="relative">
                  <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input name="medicalLicense" value={formData.medicalLicense} onChange={handleChange} required className="input-field pl-11" placeholder="Medical License Number" />
                </div>
              </div>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                <input name="password" type="password" value={formData.password} onChange={handleChange} required className="input-field pl-11" placeholder="Password" />
              </div>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="input-field" placeholder="Confirm" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{formData.role === 'doctor' ? 'Submit Application' : 'Create Account'}</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-surface-500 mt-5 text-sm">
            Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
