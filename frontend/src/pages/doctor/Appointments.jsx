import { useState } from 'react';
import { FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const appointments = [
  { _id: '1', patient: { name: 'Rahul Singh', age: 28, gender: 'Male' }, date: '2024-12-20', timeSlot: '10:00 AM', status: 'pending', type: 'general', symptoms: ['fever', 'cough'] },
  { _id: '2', patient: { name: 'Priya Mehta', age: 35, gender: 'Female' }, date: '2024-12-20', timeSlot: '11:30 AM', status: 'confirmed', type: 'follow-up', symptoms: ['headache'] },
  { _id: '3', patient: { name: 'Amit Kumar', age: 42, gender: 'Male' }, date: '2024-12-21', timeSlot: '02:00 PM', status: 'pending', type: 'specialist', symptoms: ['chest pain', 'shortness of breath'] },
];

const DoctorAppointments = () => {
  const [list, setList] = useState(appointments);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? list : list.filter(a => a.status === filter);

  const updateStatus = (id, status) => {
    setList(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    toast.success(`Appointment ${status}`);
  };

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><FaCalendarAlt className="text-primary-500" /> Manage Appointments</h1>

      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-primary-500 text-white' : 'bg-surface-100 dark:bg-surface-700'}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((apt, i) => (
          <div key={apt._id} className="glass-card p-5 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold">{apt.patient.name.charAt(0)}</div>
                <div>
                  <h3 className="font-bold">{apt.patient.name}</h3>
                  <p className="text-sm text-surface-500">{apt.patient.age} yrs, {apt.patient.gender} · {apt.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{new Date(apt.date).toLocaleDateString()}</p>
                <p className="text-sm text-primary-600">{apt.timeSlot}</p>
              </div>
            </div>
            {apt.symptoms.length > 0 && (
              <div className="flex gap-2 mb-3">{apt.symptoms.map(s => <span key={s} className="badge-info text-xs">{s}</span>)}</div>
            )}
            {apt.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => updateStatus(apt._id, 'confirmed')} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-all"><FaCheck /> Confirm</button>
                <button onClick={() => updateStatus(apt._id, 'cancelled')} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all"><FaTimes /> Decline</button>
              </div>
            )}
            {apt.status === 'confirmed' && (
              <button onClick={() => updateStatus(apt._id, 'completed')} className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-all">Mark Complete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
