import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHeartbeat, FaBrain, FaCalendarAlt, FaPills, FaHospital, FaFileMedical, FaWeight, FaTint } from 'react-icons/fa';
import { FiActivity, FiTrendingUp, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const { user } = useAuth();
  const bmi = user?.bmi || (user?.weight && user?.height ? (user.weight / ((user.height / 100) ** 2)).toFixed(1) : 22.5);
  const healthScore = user?.healthScore || 78;

  const quickActions = [
    { icon: FaBrain, label: 'Check Symptoms', path: '/patient/symptoms', color: 'from-blue-500 to-cyan-500', desc: 'AI-powered diagnosis' },
    { icon: FaCalendarAlt, label: 'Book Appointment', path: '/patient/appointments', color: 'from-purple-500 to-pink-500', desc: 'Find a doctor' },
    { icon: FaHospital, label: 'Find Hospital', path: '/patient/hospitals', color: 'from-green-500 to-emerald-500', desc: 'Nearby hospitals' },
    { icon: FaFileMedical, label: 'Health Records', path: '/patient/records', color: 'from-orange-500 to-amber-500', desc: 'View reports' },
  ];

  const stats = [
    { icon: FaHeartbeat, label: 'Health Score', value: `${healthScore}/100`, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { icon: FaWeight, label: 'BMI', value: bmi, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: FaCalendarAlt, label: 'Appointments', value: '3 Upcoming', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { icon: FaPills, label: 'Medicines', value: '2 Active', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  const healthChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Health Score',
      data: [65, 68, 72, 70, 75, healthScore],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#3b82f6',
    }]
  };

  const bmiChartData = {
    labels: ['Healthy', 'Current', 'Risk'],
    datasets: [{
      data: [bmi > 25 ? 30 : 50, 30, bmi > 25 ? 40 : 20],
      backgroundColor: ['#22c55e', '#3b82f6', '#ef4444'],
      borderWidth: 0,
    }]
  };

  const recentPredictions = [
    { disease: 'Common Cold', risk: 'Low', confidence: 85, date: '2 days ago', color: 'badge-success' },
    { disease: 'Vitamin D Deficiency', risk: 'Moderate', confidence: 72, date: '1 week ago', color: 'badge-warning' },
    { disease: 'Allergic Rhinitis', risk: 'Low', confidence: 68, date: '2 weeks ago', color: 'badge-success' },
  ];

  return (
    <div className="page-container">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back, <span className="bg-gradient-to-r from-primary-600 to-medical bg-clip-text text-transparent">{user?.name || 'Patient'}</span> 👋
        </h1>
        <p className="text-surface-500 mt-1">Here's your health overview for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="stat-card animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={`text-xl ${stat.color}`} />
              </div>
              <p className="text-sm text-surface-500">{stat.label}</p>
              <p className="text-xl font-bold mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={i} to={action.path} className="group glass-card p-5 hover:shadow-card-hover transform hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-sm">{action.label}</h3>
                <p className="text-xs text-surface-500 mt-0.5">{action.desc}</p>
                <FiArrowRight className="mt-2 text-primary-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><FiTrendingUp className="text-primary-500" /> Health Score Trend</h3>
          <Line data={healthChartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false, min: 50, max: 100 } } }} />
        </div>
        <div className="glass-card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><FiActivity className="text-primary-500" /> BMI Analysis</h3>
          <Doughnut data={bmiChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { padding: 15 } } }, cutout: '65%' }} />
          <div className="text-center mt-4">
            <p className="text-3xl font-bold text-primary-600">{bmi}</p>
            <p className="text-sm text-surface-500">{bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}</p>
          </div>
        </div>
      </div>

      {/* Recent Predictions */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2"><FiAlertCircle className="text-primary-500" /> Recent AI Predictions</h3>
          <Link to="/patient/symptoms" className="text-sm text-primary-600 hover:underline">View All</Link>
        </div>
        <div className="space-y-3">
          {recentPredictions.map((pred, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  <FaBrain className="text-primary-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{pred.disease}</p>
                  <p className="text-xs text-surface-500">{pred.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={pred.color}>{pred.risk}</span>
                <p className="text-xs text-surface-500 mt-0.5">{pred.confidence}% confidence</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
