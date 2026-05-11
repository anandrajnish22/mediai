import { useState } from 'react';
import { FaUsers, FaFileMedical } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

const patients = [
  { _id: '1', name: 'Rahul Singh', age: 28, gender: 'Male', bloodGroup: 'O+', lastVisit: '2024-12-15', totalVisits: 5, condition: 'Hypertension' },
  { _id: '2', name: 'Priya Mehta', age: 35, gender: 'Female', bloodGroup: 'A+', lastVisit: '2024-12-10', totalVisits: 3, condition: 'Diabetes Type 2' },
  { _id: '3', name: 'Amit Kumar', age: 42, gender: 'Male', bloodGroup: 'B+', lastVisit: '2024-12-08', totalVisits: 8, condition: 'Cardiac Monitoring' },
  { _id: '4', name: 'Sneha Gupta', age: 25, gender: 'Female', bloodGroup: 'AB-', lastVisit: '2024-12-05', totalVisits: 2, condition: 'General Checkup' },
];

const DoctorPatients = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><FaUsers className="text-primary-500" /> My Patients</h1>

      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search patients..." />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((p, i) => (
            <div key={p._id} onClick={() => setSelected(p)}
              className={`glass-card p-5 cursor-pointer hover:shadow-card-hover transition-all animate-slide-up ${selected?._id === p._id ? 'ring-2 ring-primary-500' : ''}`} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold">{p.name.charAt(0)}</div>
                  <div>
                    <h3 className="font-bold">{p.name}</h3>
                    <p className="text-sm text-surface-500">{p.age} yrs, {p.gender} · {p.bloodGroup}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="badge-info text-xs">{p.condition}</span>
                  <p className="text-xs text-surface-500 mt-1">Last: {new Date(p.lastVisit).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          {selected ? (
            <div className="glass-card p-6 sticky top-20 animate-fade-in">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2">{selected.name.charAt(0)}</div>
                <h3 className="font-bold text-lg">{selected.name}</h3>
                <p className="text-surface-500 text-sm">{selected.age} yrs · {selected.gender}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50"><span className="text-surface-500">Blood Group</span><span className="font-medium">{selected.bloodGroup}</span></div>
                <div className="flex justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50"><span className="text-surface-500">Condition</span><span className="font-medium">{selected.condition}</span></div>
                <div className="flex justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50"><span className="text-surface-500">Total Visits</span><span className="font-medium">{selected.totalVisits}</span></div>
                <div className="flex justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50"><span className="text-surface-500">Last Visit</span><span className="font-medium">{new Date(selected.lastVisit).toLocaleDateString()}</span></div>
              </div>
              <button className="btn-primary w-full mt-4 text-sm flex items-center justify-center gap-2"><FaFileMedical /> View Records</button>
            </div>
          ) : (
            <div className="glass-card p-8 text-center"><FaUsers className="text-5xl text-surface-300 mx-auto mb-3" /><p className="text-surface-500">Select a patient to view details</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
