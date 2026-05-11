import { FaCalendarAlt, FaUsers, FaChartLine, FaClock, FaCheckCircle } from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const DoctorDashboard = () => {
  const stats = [
    { icon: FaUsers, label: 'Total Patients', value: '248', change: '+12 this week', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: FaCalendarAlt, label: 'Today\'s Appointments', value: '8', change: '3 pending', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { icon: FaCheckCircle, label: 'Completed', value: '1,847', change: '98% satisfaction', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { icon: FaChartLine, label: 'Revenue', value: '₹2.4L', change: '+15% this month', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  const todayAppointments = [
    { name: 'Rahul Singh', time: '09:00 AM', type: 'Follow-up', status: 'confirmed' },
    { name: 'Priya Mehta', time: '10:00 AM', type: 'Consultation', status: 'confirmed' },
    { name: 'Amit Kumar', time: '11:30 AM', type: 'Check-up', status: 'pending' },
    { name: 'Sneha Gupta', time: '02:00 PM', type: 'Emergency', status: 'confirmed' },
    { name: 'Vikash Patel', time: '03:30 PM', type: 'Follow-up', status: 'pending' },
  ];

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{ label: 'Appointments', data: [8, 12, 6, 10, 14, 5], backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 8 }]
  };

  const patientTypes = {
    labels: ['General', 'Follow-up', 'Emergency', 'Specialist'],
    datasets: [{ data: [40, 30, 10, 20], backgroundColor: ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b'], borderWidth: 0 }]
  };

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><Icon className={`text-xl ${s.color}`} /></div>
              <p className="text-sm text-surface-500">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
              <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><FiTrendingUp />{s.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><FaClock className="text-primary-500" /> Today's Appointments</h3>
          <div className="space-y-3">
            {todayAppointments.map((apt, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">{apt.name.split(' ').map(n=>n[0]).join('')}</div>
                  <div>
                    <p className="font-semibold text-sm">{apt.name}</p>
                    <p className="text-xs text-surface-500">{apt.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary-600">{apt.time}</p>
                  <span className={`text-xs ${apt.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>{apt.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Types */}
        <div className="glass-card p-6">
          <h3 className="font-bold mb-4">Patient Distribution</h3>
          <Doughnut data={patientTypes} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { padding: 12 } } }, cutout: '60%' }} />
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="glass-card p-6">
        <h3 className="font-bold mb-4">Weekly Appointments</h3>
        <Bar data={weeklyData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
      </div>
    </div>
  );
};

export default DoctorDashboard;
