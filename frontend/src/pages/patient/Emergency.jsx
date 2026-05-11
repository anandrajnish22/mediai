import { useState } from 'react';
import { FaAmbulance, FaPhone, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
import { FiAlertCircle, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Emergency = () => {
  const [sosActive, setSosActive] = useState(false);
  const [emergencyType, setEmergencyType] = useState('medical');
  const [countdown, setCountdown] = useState(null);

  const handleSOS = () => {
    if (sosActive) { setSosActive(false); setCountdown(null); toast.success('SOS Cancelled'); return; }
    let count = 5;
    setCountdown(count);
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        setSosActive(true);
        setCountdown(null);
        toast.success('🚨 Emergency SOS Activated! Help is on the way.');
      }
    }, 1000);
  };

  const emergencyTypes = [
    { id: 'medical', label: 'Medical', icon: '🏥', color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { id: 'accident', label: 'Accident', icon: '🚗', color: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' },
    { id: 'cardiac', label: 'Cardiac', icon: '❤️', color: 'border-red-500 bg-red-50 dark:bg-red-900/20' },
    { id: 'breathing', label: 'Breathing', icon: '🫁', color: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' },
  ];

  const emergencyContacts = [
    { name: 'Ambulance', number: '102', icon: '🚑' },
    { name: 'Police', number: '100', icon: '🚔' },
    { name: 'Fire', number: '101', icon: '🚒' },
    { name: 'Emergency', number: '112', icon: '📞' },
  ];

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><FaAmbulance className="text-red-500" /> Emergency SOS</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* SOS Button */}
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-bold mb-6">Press for Emergency Help</h2>

          {/* Emergency Type Selection */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {emergencyTypes.map(t => (
              <button key={t.id} onClick={() => setEmergencyType(t.id)}
                className={`p-4 rounded-xl border-2 transition-all ${emergencyType === t.id ? t.color + ' border-2' : 'border-surface-200 dark:border-surface-700'}`}>
                <span className="text-2xl">{t.icon}</span>
                <p className="text-sm font-medium mt-1">{t.label}</p>
              </button>
            ))}
          </div>

          {/* Big SOS Button */}
          <button onClick={handleSOS}
            className={`w-48 h-48 rounded-full mx-auto flex items-center justify-center text-white font-black text-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 ${sosActive ? 'bg-green-500 shadow-green-500/50 animate-pulse' : 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/40 hover:shadow-red-500/60'}`}>
            {countdown !== null ? (
              <span className="text-6xl">{countdown}</span>
            ) : sosActive ? (
              <span className="text-lg">SOS ACTIVE<br />Tap to Cancel</span>
            ) : (
              <span>SOS</span>
            )}
          </button>

          {sosActive && (
            <div className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-fade-in">
              <p className="text-green-700 dark:text-green-400 font-semibold flex items-center justify-center gap-2"><FiShield /> Emergency services have been notified</p>
              <p className="text-sm text-surface-500 mt-1">Your live location is being shared</p>
            </div>
          )}

          <p className="text-xs text-surface-500 mt-4">
            <FiAlertCircle className="inline mr-1" />
            Press and hold for 5 seconds to activate emergency SOS
          </p>
        </div>

        {/* Emergency Contacts & Info */}
        <div className="space-y-6">
          {/* Quick Dial */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">Emergency Numbers</h3>
            <div className="grid grid-cols-2 gap-3">
              {emergencyContacts.map(c => (
                <a key={c.number} href={`tel:${c.number}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className="text-primary-600 font-mono">{c.number}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Personal Emergency Contacts */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">Personal Emergency Contacts</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                <div><p className="font-semibold text-sm">Amit Singh (Brother)</p><p className="text-xs text-surface-500">+91 98765 43221</p></div>
                <a href="tel:+919876543221" className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20"><FaPhone className="text-green-500" /></a>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="glass-card p-6 border-l-4 border-yellow-500">
            <h3 className="font-bold mb-2 flex items-center gap-2"><FaExclamationTriangle className="text-yellow-500" /> Emergency Tips</h3>
            <ul className="text-sm text-surface-500 space-y-1.5">
              <li>• Stay calm and assess the situation</li>
              <li>• Call emergency services immediately</li>
              <li>• Provide your exact location</li>
              <li>• Follow dispatcher instructions</li>
              <li>• Don't move injured person unless necessary</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
