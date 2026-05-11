import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { FaHeartbeat } from 'react-icons/fa';
import { useState } from 'react';

const MainLayout = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Get Started' },
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200/50 dark:border-surface-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-all">
                <FaHeartbeat className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-medical bg-clip-text text-transparent">MediAI</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    link.path === '/register'
                      ? 'btn-primary text-sm !py-2'
                      : location.pathname === link.path
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                      : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button onClick={toggleDarkMode} className="ml-2 p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
                {darkMode ? <FiSun className="text-yellow-400 text-lg" /> : <FiMoon className="text-surface-600 text-lg" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800">
              {mobileMenu ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700 animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setMobileMenu(false)}
                  className="block px-4 py-3 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
                  {link.label}
                </Link>
              ))}
              <button onClick={toggleDarkMode} className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800">
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface-900 dark:bg-surface-900 text-surface-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <FaHeartbeat className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold text-white">MediAI</span>
              </div>
              <p className="text-sm text-surface-400">AI-powered healthcare platform for smart disease prediction and health management.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li>AI Symptom Checker</li><li>Disease Prediction</li><li>Hospital Finder</li><li>Health Records</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li>Patient Dashboard</li><li>Doctor Portal</li><li>Admin Panel</li><li>Emergency SOS</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li>📧 support@mediai.com</li><li>📞 +91 98765 43210</li><li>📍 New Delhi, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-800 mt-8 pt-8 text-center text-sm text-surface-500">
            © 2024 MediAI. All rights reserved. Built with ❤️ for healthcare.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
