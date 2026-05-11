import { Link } from 'react-router-dom';
import { FaHeartbeat, FaBrain, FaHospital, FaCalendarAlt, FaFileMedical, FaRobot, FaAmbulance, FaPills, FaShieldAlt, FaChartLine, FaUserMd, FaMobileAlt } from 'react-icons/fa';
import { FiArrowRight, FiCheckCircle, FiStar } from 'react-icons/fi';

const features = [
  { icon: FaBrain, title: 'AI Symptom Checker', desc: 'Advanced AI analyzes symptoms and predicts diseases with confidence scores', color: 'from-blue-500 to-cyan-500' },
  { icon: FaChartLine, title: 'Health Risk Prediction', desc: 'ML models predict diabetes, heart disease and health risks in real-time', color: 'from-purple-500 to-pink-500' },
  { icon: FaHospital, title: 'Hospital Finder', desc: 'Find nearest hospitals with real-time availability and emergency services', color: 'from-green-500 to-emerald-500' },
  { icon: FaCalendarAlt, title: 'Smart Appointments', desc: 'Book appointments with top doctors, manage schedules effortlessly', color: 'from-orange-500 to-amber-500' },
  { icon: FaFileMedical, title: 'Digital Health Records', desc: 'Securely store prescriptions, reports and medical documents digitally', color: 'from-teal-500 to-cyan-500' },
  { icon: FaRobot, title: 'AI Health Chatbot', desc: 'Get instant health guidance, diet tips and wellness support 24/7', color: 'from-indigo-500 to-violet-500' },
  { icon: FaAmbulance, title: 'Emergency SOS', desc: 'One-tap emergency alert with live location to hospitals and contacts', color: 'from-red-500 to-rose-500' },
  { icon: FaPills, title: 'Medicine Reminders', desc: 'Never miss a dose with smart medicine and water intake reminders', color: 'from-yellow-500 to-orange-500' },
];

const stats = [
  { value: '10K+', label: 'Patients Served' },
  { value: '500+', label: 'Expert Doctors' },
  { value: '98%', label: 'AI Accuracy' },
  { value: '24/7', label: 'Emergency Support' },
];

const Landing = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-400/5 rounded-full blur-3xl animate-pulse-slow" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
                <FaHeartbeat className="text-cyan-400 animate-pulse" />
                <span>AI-Powered Healthcare Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                Smart Health<br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">Starts Here</span>
              </h1>
              <p className="text-lg text-white/70 mb-8 max-w-lg">
                Experience next-generation healthcare with AI disease prediction, symptom checking, and comprehensive health management — all in one platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold hover:shadow-2xl hover:shadow-white/20 transform hover:-translate-y-1 transition-all duration-300">
                  Get Started Free <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300">
                  Learn More
                </Link>
              </div>
              {/* Trust indicators */}
              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-white/50 flex items-center justify-center text-white text-xs font-bold">
                      {['RS', 'AP', 'VK', 'SM'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-400">{[...Array(5)].map((_, i) => <FiStar key={i} className="fill-current" />)}</div>
                  <p className="text-white/60 text-sm">Trusted by 10,000+ users</p>
                </div>
              </div>
            </div>

            {/* Hero Card */}
            <div className="hidden lg:block animate-slide-up">
              <div className="relative">
                <div className="glass-card !bg-white/10 !border-white/15 p-8 rounded-3xl backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                      <FaBrain className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">AI Health Analysis</h3>
                      <p className="text-white/50 text-sm">Real-time prediction</p>
                    </div>
                  </div>
                  {/* Mock health metrics */}
                  <div className="space-y-4">
                    {['Heart Health', 'Blood Sugar', 'BMI Score'].map((metric, i) => (
                      <div key={metric}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">{metric}</span>
                          <span className="text-cyan-400 font-semibold">{[92, 85, 78][i]}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${['from-green-400 to-emerald-400', 'from-cyan-400 to-blue-400', 'from-yellow-400 to-orange-400'][i]}`} style={{ width: `${[92, 85, 78][i]}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-2xl bg-green-500/10 border border-green-400/20">
                    <div className="flex items-center gap-2 text-green-400">
                      <FiCheckCircle /><span className="text-sm font-medium">Overall Health Score: Excellent</span>
                    </div>
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 glass-card !bg-white/15 !border-white/20 p-3 rounded-xl animate-bounce-gentle">
                  <div className="flex items-center gap-2 text-white text-sm"><FaShieldAlt className="text-green-400" /> HIPAA Compliant</div>
                </div>
                <div className="absolute -bottom-4 -left-4 glass-card !bg-white/15 !border-white/20 p-3 rounded-xl animate-bounce-gentle" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2 text-white text-sm"><FaUserMd className="text-cyan-400" /> 500+ Doctors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-surface-800 border-y border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary-600 to-medical bg-clip-text text-transparent">{stat.value}</div>
                <p className="text-surface-500 mt-1 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface-50 dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-sm font-medium mb-4">
              ✨ Comprehensive Features
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-surface-900 dark:text-white">
              Everything You Need for <span className="bg-gradient-to-r from-primary-600 to-medical bg-clip-text text-transparent">Better Health</span>
            </h2>
            <p className="mt-4 text-surface-500 max-w-2xl mx-auto">Powered by cutting-edge AI and machine learning to provide accurate health insights and seamless healthcare management.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="group glass-card p-6 hover:shadow-card-hover transform hover:-translate-y-2 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="text-white text-2xl" />
                  </div>
                  <h3 className="font-bold text-surface-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-surface-500 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Ready to Take Control of Your Health?</h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">Join thousands of users who trust MediAI for intelligent health monitoring and disease prediction.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="group inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-primary-700 font-bold text-lg hover:shadow-2xl hover:shadow-white/20 transform hover:-translate-y-1 transition-all duration-300">
              Start Free Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
