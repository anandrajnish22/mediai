import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeartbeat, FaClock, FaTimesCircle, FaBan } from 'react-icons/fa';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApprovalMessage(null);
    try {
      const res = await login(email, password);
      toast.success('Welcome back!');
      const role = res.data?.role || 'patient';
      navigate(`/${role}`);
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      // Handle doctor approval statuses
      if (status === 403 && data?.approvalStatus) {
        const statusConfig = {
          pending: { icon: FaClock, color: 'yellow', title: 'Awaiting Approval', bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700' },
          rejected: { icon: FaTimesCircle, color: 'red', title: 'Application Rejected', bg: 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' },
          suspended: { icon: FaBan, color: 'orange', title: 'Account Suspended', bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700' }
        };
        setApprovalMessage({
          ...statusConfig[data.approvalStatus],
          message: data.message,
          status: data.approvalStatus
        });
      } else {
        toast.error(data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const demoLogins = [
    { label: 'Patient', email: 'patient@mediai.com', password: 'patient123', color: 'bg-blue-500' },
    { label: 'Admin', email: 'admin@mediai.com', password: 'admin123', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-surface-900">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/25">
              <FaHeartbeat className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-medical bg-clip-text text-transparent">MediAI</span>
          </Link>

          <h1 className="text-3xl font-black mb-2">Welcome Back 👋</h1>
          <p className="text-surface-500 mb-8">Sign in to access your health dashboard</p>

          {/* Approval Status Message */}
          {approvalMessage && (
            <div className={`p-4 rounded-xl border-2 mb-6 animate-slide-up ${approvalMessage.bg}`}>
              <div className="flex items-center gap-3 mb-2">
                <approvalMessage.icon className={`text-xl text-${approvalMessage.color}-500`} />
                <h3 className="font-bold text-sm">{approvalMessage.title}</h3>
              </div>
              <p className="text-sm text-surface-600 dark:text-surface-400">{approvalMessage.message}</p>
              {approvalMessage.status === 'pending' && (
                <p className="text-xs text-surface-500 mt-2">You will receive a notification once your account is reviewed by an admin.</p>
              )}
              {approvalMessage.status === 'rejected' && (
                <p className="text-xs text-surface-500 mt-2">If you believe this is an error, please contact support at support@mediai.com</p>
              )}
            </div>
          )}

          {/* Demo Login Buttons */}
          <div className="flex gap-2 mb-6">
            {demoLogins.map((demo) => (
              <button key={demo.label} onClick={() => { setEmail(demo.email); setPassword(demo.password); setApprovalMessage(null); }}
                className="flex-1 py-2 px-3 rounded-xl border border-surface-200 dark:border-surface-700 text-sm font-medium hover:bg-surface-50 dark:hover:bg-surface-800 transition-all">
                <span className={`inline-block w-2 h-2 rounded-full ${demo.color} mr-2`} />{demo.label} Demo
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setApprovalMessage(null); }} required
                  className="input-field pl-11" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="input-field pl-11 pr-11" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Sign In</span><FiArrowRight /></>}
            </button>
          </form>

          <p className="text-center text-surface-500 mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative text-center text-white p-12">
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-8">
            <FaHeartbeat className="text-5xl text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Your Health, Our Priority</h2>
          <p className="text-white/70 max-w-sm mx-auto">AI-powered disease prediction, health analytics, and comprehensive healthcare management at your fingertips.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
