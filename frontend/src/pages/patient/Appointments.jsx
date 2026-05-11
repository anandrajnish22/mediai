import { useState } from 'react';
import { FaCalendarAlt, FaUserMd, FaClock } from 'react-icons/fa';
import { FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const demoAppointments = [
  { _id: '1', doctor: { name: 'Dr. Priya Sharma', specialization: 'Cardiologist' }, date: '2024-12-20', timeSlot: '10:00 AM', status: 'confirmed', type: 'specialist' },
  { _id: '2', doctor: { name: 'Dr. Vikram Patel', specialization: 'General Physician' }, date: '2024-12-22', timeSlot: '02:30 PM', status: 'pending', type: 'general' },
  { _id: '3', doctor: { name: 'Dr. Anita Desai', specialization: 'Dermatologist' }, date: '2024-12-18', timeSlot: '11:00 AM', status: 'completed', type: 'follow-up' },
];

const statusColors = { pending: 'badge-warning', confirmed: 'badge-info', completed: 'badge-success', cancelled: 'badge-danger' };
const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

const Appointments = () => {
  const [appointments] = useState(demoAppointments);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><FaCalendarAlt className="text-primary-500" /> Appointments</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm"><FiPlus /> Book New</button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all capitalize ${filter === f ? 'bg-primary-500 text-white' : 'bg-surface-100 dark:bg-surface-700'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filtered.map((apt, i) => (
          <div key={apt._id} className="glass-card p-5 hover:shadow-card-hover transition-all animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold">
                  {apt.doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold">{apt.doctor.name}</h3>
                  <p className="text-sm text-surface-500">{apt.doctor.specialization}</p>
                </div>
              </div>
              <span className={statusColors[apt.status]}>{apt.status}</span>
            </div>
            <div className="flex items-center gap-6 mt-4 text-sm text-surface-500">
              <span className="flex items-center gap-1"><FaCalendarAlt className="text-primary-500" /> {new Date(apt.date).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><FaClock className="text-primary-500" /> {apt.timeSlot}</span>
              <span className="badge-info capitalize">{apt.type}</span>
            </div>
            {apt.status === 'pending' && (
              <div className="mt-3 flex gap-2">
                <button className="text-sm text-primary-600 hover:underline">Reschedule</button>
                <button onClick={() => toast.success('Cancelled')} className="text-sm text-red-500 hover:underline">Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Book Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card !bg-white dark:!bg-surface-800 p-6 w-full max-w-md animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Book Appointment</h2>
              <button onClick={() => setShowModal(false)}><FiX className="text-xl" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Doctor</label>
                <select className="input-field mt-1"><option>Dr. Priya Sharma - Cardiologist</option><option>Dr. Vikram Patel - General Physician</option><option>Dr. Anita Desai - Dermatologist</option></select>
              </div>
              <div><label className="text-sm font-medium">Date</label><input type="date" className="input-field mt-1" /></div>
              <div><label className="text-sm font-medium">Time Slot</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {timeSlots.slice(0, 6).map(t => <button key={t} className="py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-sm hover:bg-primary-50 hover:border-primary-500 transition-all">{t}</button>)}
                </div>
              </div>
              <div><label className="text-sm font-medium">Symptoms/Notes</label><textarea className="input-field mt-1" rows={2} placeholder="Describe your symptoms..." /></div>
              <button onClick={() => { setShowModal(false); toast.success('Appointment booked!'); }} className="btn-primary w-full">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
