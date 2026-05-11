import { FaUsers, FaHospital, FaCalendarAlt, FaBrain, FaAmbulance, FaUserMd } from 'react-icons/fa';
import { FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const stats = [
    { icon: FaUsers, label: 'Total Patients', value: '10,248', change: '+256 this month', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: FaUserMd, label: 'Active Doctors', value: '512', change: '+18 new', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { icon: FaHospital, label: 'Hospitals', value: '86', change: '5 pending', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { icon: FaCalendarAlt, label: 'Appointments', value: '34,521', change: '+1,200 this week', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { icon: FaBrain, label: 'AI Predictions', value: '28,934', change: '98% accuracy', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
    { icon: FaAmbulance, label: 'Emergencies', value: '47', change: '3 active now', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  ];

  const monthlyUsers = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'New Users', data: [420, 580, 720, 650, 890, 1100, 980, 1250, 1400, 1100, 1600, 1800],
      borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4, pointRadius: 3,
    }]
  };

  const diseaseStats = {
    labels: ['Common Cold', 'Diabetes', 'Hypertension', 'Dengue', 'Asthma', 'Others'],
    datasets: [{ data: [28, 22, 18, 12, 10, 10], backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#8b5cf6', '#6b7280'], borderWidth: 0 }]
  };

  const appointmentTrends = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Booked', data: [120, 145, 130, 160, 180, 95, 50], backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 6 },
      { label: 'Completed', data: [110, 135, 120, 148, 165, 88, 42], backgroundColor: 'rgba(34,197,94,0.7)', borderRadius: 6 },
    ]
  };

  const recentActivity = [
    { text: 'New doctor Dr. Meena registered', time: '5 min ago', type: 'user' },
    { text: 'Emergency SOS from patient #4521', time: '12 min ago', type: 'emergency' },
    { text: 'Apollo Hospital verified', time: '1 hour ago', type: 'hospital' },
    { text: 'AI prediction accuracy reached 98.5%', time: '2 hours ago', type: 'ai' },
    { text: '150 new patients registered today', time: '3 hours ago', type: 'user' },
  ];

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><Icon className={`text-xl ${s.color}`} /></div>
              <p className="text-sm text-surface-500">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
              <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><FiTrendingUp /> {s.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* User Growth */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-bold mb-4">User Growth Trend</h3>
          <Line data={monthlyUsers} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
        </div>
        {/* Disease Stats */}
        <div className="glass-card p-6">
          <h3 className="font-bold mb-4">Disease Distribution</h3>
          <Doughnut data={diseaseStats} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { padding: 10, font: { size: 11 } } } }, cutout: '55%' }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Appointment Trends */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-bold mb-4">Weekly Appointment Trends</h3>
          <Bar data={appointmentTrends} options={{ responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }} />
        </div>
        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><FiAlertCircle className="text-primary-500" /> Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50 text-sm">
                <p className="font-medium">{a.text}</p>
                <p className="text-xs text-surface-500 mt-0.5">{a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
