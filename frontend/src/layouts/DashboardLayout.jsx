import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { FaHeartbeat, FaUserMd, FaHospital, FaCalendarAlt, FaFileMedical, FaRobot, FaAmbulance, FaPills, FaChartBar, FaUsers, FaStethoscope, FaBrain } from 'react-icons/fa';
import { FiHome, FiUser, FiLogOut, FiSun, FiMoon, FiBell, FiMenu, FiX } from 'react-icons/fi';

const sidebarLinks = {
  patient: [
    { path: '/patient', icon: FiHome, label: 'Dashboard' },
    { path: '/patient/symptoms', icon: FaStethoscope, label: 'Symptom Checker' },
    { path: '/patient/predict', icon: FaBrain, label: 'Health Prediction' },
    { path: '/patient/hospitals', icon: FaHospital, label: 'Find Hospitals' },
    { path: '/patient/appointments', icon: FaCalendarAlt, label: 'Appointments' },
    { path: '/patient/records', icon: FaFileMedical, label: 'Health Records' },
    { path: '/patient/chatbot', icon: FaRobot, label: 'AI Chatbot' },
    { path: '/patient/emergency', icon: FaAmbulance, label: 'Emergency SOS' },
    { path: '/patient/reminders', icon: FaPills, label: 'Medicine Reminder' },
    { path: '/patient/profile', icon: FiUser, label: 'Profile' },
  ],
  doctor: [
    { path: '/doctor', icon: FiHome, label: 'Dashboard' },
    { path: '/doctor/appointments', icon: FaCalendarAlt, label: 'Appointments' },
    { path: '/doctor/patients', icon: FaUsers, label: 'My Patients' },
    { path: '/doctor/profile', icon: FiUser, label: 'Profile' },
  ],
  admin: [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/doctors', icon: FaUserMd, label: 'Doctor Approvals' },
    { path: '/admin/users', icon: FaUsers, label: 'Manage Users' },
    { path: '/admin/hospitals', icon: FaHospital, label: 'Manage Hospitals' },
  ]
};

const DashboardLayout = ({ role }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const links = sidebarLinks[role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-surface-200 dark:border-surface-700">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/25">
            <FaHeartbeat className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-medical bg-clip-text text-transparent">MediAI</h1>
            <p className="text-[10px] text-surface-500 uppercase tracking-wider">{role} Portal</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto p-1"><FiX className="text-lg" /></button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {links.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)}
                className={`sidebar-link ${isActive ? 'active' : ''}`}>
                <Icon className="text-lg flex-shrink-0" />
                <span className="text-sm">{link.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-surface-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-danger hover:bg-danger-light dark:hover:bg-red-900/20 transition-all">
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700">
              <FiMenu className="text-xl" />
            </button>
            <h2 className="text-lg font-semibold capitalize hidden sm:block">{role} Dashboard</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 relative transition-all">
              <FiBell className="text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
            </button>
            <button onClick={toggleDarkMode} className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-all">
              {darkMode ? <FiSun className="text-lg text-yellow-400" /> : <FiMoon className="text-lg" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
