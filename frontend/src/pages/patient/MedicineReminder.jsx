import { useState } from 'react';
import { FaPills, FaTint, FaPlus, FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const demoReminders = [
  { id: 1, name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily', times: ['08:00 AM', '08:00 PM'], isActive: true },
  { id: 2, name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Once daily', times: ['09:00 AM'], isActive: true },
  { id: 3, name: 'Omeprazole', dosage: '20mg', frequency: 'Before breakfast', times: ['07:30 AM'], isActive: false },
];

const MedicineReminder = () => {
  const [reminders, setReminders] = useState(demoReminders);
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: 'Once daily', time: '08:00' });
  const [waterCount, setWaterCount] = useState(3);

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
    toast.success('Reminder updated!');
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    toast.success('Reminder deleted');
  };

  const addReminder = () => {
    if (!newMed.name) return toast.error('Enter medicine name');
    setReminders(prev => [...prev, { id: Date.now(), name: newMed.name, dosage: newMed.dosage, frequency: newMed.frequency, times: [newMed.time], isActive: true }]);
    setShowAdd(false);
    setNewMed({ name: '', dosage: '', frequency: 'Once daily', time: '08:00' });
    toast.success('Reminder added!');
  };

  const waterGoal = 8;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><FaPills className="text-primary-500" /> Medicine Reminders</h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 text-sm"><FaPlus /> Add Medicine</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Medicine List */}
        <div className="lg:col-span-2 space-y-4">
          {reminders.map((rem, i) => (
            <div key={rem.id} className={`glass-card p-5 transition-all animate-slide-up ${!rem.isActive ? 'opacity-60' : ''}`} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${rem.isActive ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-surface-300 dark:bg-surface-600'}`}>
                    <FaPills className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold">{rem.name}</h3>
                    <p className="text-sm text-surface-500">{rem.dosage} · {rem.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleReminder(rem.id)}
                    className={`w-10 h-6 rounded-full transition-all relative ${rem.isActive ? 'bg-green-500' : 'bg-surface-300 dark:bg-surface-600'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${rem.isActive ? 'left-4' : 'left-0.5'}`} />
                  </button>
                  <button onClick={() => deleteReminder(rem.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                    <FaTrash className="text-red-400 text-sm" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-surface-500">
                <FiClock className="text-primary-500" />
                {rem.times.map(t => <span key={t} className="px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs font-medium">{t}</span>)}
                {rem.isActive && <span className="ml-auto flex items-center gap-1 text-green-500"><FaBell className="text-xs" /> Active</span>}
              </div>
            </div>
          ))}

          {reminders.length === 0 && (
            <div className="glass-card p-12 text-center">
              <FaPills className="text-5xl text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500">No medicine reminders set. Add one to get started!</p>
            </div>
          )}
        </div>

        {/* Water Tracker & Stats */}
        <div className="space-y-6">
          {/* Water Tracker */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><FaTint className="text-blue-500" /> Water Intake</h3>
            <div className="text-center mb-4">
              <p className="text-4xl font-black text-blue-500">{waterCount}<span className="text-lg text-surface-400">/{waterGoal}</span></p>
              <p className="text-sm text-surface-500">glasses today</p>
            </div>
            <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden mb-4">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-500" style={{ width: `${(waterCount / waterGoal) * 100}%` }} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => { if (waterCount > 0) setWaterCount(c => c - 1); }} className="flex-1 py-2 rounded-xl bg-surface-100 dark:bg-surface-700 font-medium hover:bg-surface-200 transition-all">−</button>
              <button onClick={() => { setWaterCount(c => c + 1); toast.success('💧 Great job!'); }} className="flex-1 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all">+ Glass</button>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {reminders.filter(r => r.isActive).map(r => (
                r.times.map(t => (
                  <div key={`${r.id}-${t}`} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-primary-600">{t}</span>
                      <span className="text-sm font-medium">{r.name}</span>
                    </div>
                    <button className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 transition-all">
                      <FaCheck className="text-green-500 text-xs" />
                    </button>
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card !bg-white dark:!bg-surface-800 p-6 w-full max-w-md animate-slide-up">
            <h2 className="text-xl font-bold mb-4">Add Medicine Reminder</h2>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Medicine Name</label><input value={newMed.name} onChange={e => setNewMed(p => ({ ...p, name: e.target.value }))} className="input-field mt-1" placeholder="e.g., Paracetamol" /></div>
              <div><label className="text-sm font-medium">Dosage</label><input value={newMed.dosage} onChange={e => setNewMed(p => ({ ...p, dosage: e.target.value }))} className="input-field mt-1" placeholder="e.g., 500mg" /></div>
              <div><label className="text-sm font-medium">Frequency</label>
                <select value={newMed.frequency} onChange={e => setNewMed(p => ({ ...p, frequency: e.target.value }))} className="input-field mt-1">
                  <option>Once daily</option><option>Twice daily</option><option>Three times daily</option><option>Before meals</option><option>After meals</option>
                </select>
              </div>
              <div><label className="text-sm font-medium">Time</label><input type="time" value={newMed.time} onChange={e => setNewMed(p => ({ ...p, time: e.target.value }))} className="input-field mt-1" /></div>
              <div className="flex gap-3">
                <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
                <button onClick={addReminder} className="btn-primary flex-1 text-sm">Add Reminder</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineReminder;
