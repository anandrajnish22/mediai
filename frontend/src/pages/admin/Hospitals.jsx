import { useState } from 'react';
import { FaHospital, FaPlus, FaStar, FaTrash, FaCheck } from 'react-icons/fa';
import { FiSearch, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const demoHospitals = [
  { _id: '1', name: 'Apollo Hospital', city: 'Delhi', departments: 6, doctors: 45, rating: 4.5, isVerified: true, isActive: true, beds: 710, emergency: true },
  { _id: '2', name: 'AIIMS Hospital', city: 'Delhi', departments: 20, doctors: 200, rating: 4.8, isVerified: true, isActive: true, beds: 2500, emergency: true },
  { _id: '3', name: 'Fortis Hospital', city: 'Delhi', departments: 4, doctors: 30, rating: 4.3, isVerified: true, isActive: true, beds: 300, emergency: true },
  { _id: '4', name: 'City Medical Center', city: 'Mumbai', departments: 3, doctors: 12, rating: 3.8, isVerified: false, isActive: true, beds: 80, emergency: false },
  { _id: '5', name: 'Medanta Hospital', city: 'Gurugram', departments: 8, doctors: 85, rating: 4.7, isVerified: true, isActive: true, beds: 1250, emergency: true },
];

const AdminHospitals = () => {
  const [hospitals, setHospitals] = useState(demoHospitals);
  const [search, setSearch] = useState('');

  const filtered = hospitals.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase()));

  const verifyHospital = (id) => {
    setHospitals(prev => prev.map(h => h._id === id ? { ...h, isVerified: true } : h));
    toast.success('Hospital verified!');
  };

  const deleteHospital = (id) => {
    setHospitals(prev => prev.filter(h => h._id !== id));
    toast.success('Hospital removed');
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><FaHospital className="text-primary-500" /> Manage Hospitals</h1>
        <button className="btn-primary flex items-center gap-2 text-sm"><FaPlus /> Add Hospital</button>
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search hospitals..." />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((h, i) => (
          <div key={h._id} className="glass-card p-5 hover:shadow-card-hover transition-all animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold">{h.name}</h3>
                <p className="text-sm text-surface-500">{h.city}</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-500"><FaStar /><span className="font-bold text-sm">{h.rating}</span></div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="p-2 rounded-lg bg-surface-50 dark:bg-surface-700/50"><p className="text-lg font-bold text-primary-600">{h.departments}</p><p className="text-[10px] text-surface-500">Depts</p></div>
              <div className="p-2 rounded-lg bg-surface-50 dark:bg-surface-700/50"><p className="text-lg font-bold text-green-500">{h.doctors}</p><p className="text-[10px] text-surface-500">Doctors</p></div>
              <div className="p-2 rounded-lg bg-surface-50 dark:bg-surface-700/50"><p className="text-lg font-bold text-orange-500">{h.beds}</p><p className="text-[10px] text-surface-500">Beds</p></div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {h.isVerified ? <span className="badge-success text-xs">✓ Verified</span> : <span className="badge-warning text-xs">Pending</span>}
              {h.emergency && <span className="badge-danger text-xs">Emergency</span>}
            </div>

            <div className="flex gap-2">
              {!h.isVerified && <button onClick={() => verifyHospital(h._id)} className="flex-1 py-2 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-all flex items-center justify-center gap-1"><FaCheck /> Verify</button>}
              <button className="flex-1 py-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-xs font-medium hover:bg-surface-200 transition-all flex items-center justify-center gap-1"><FiEdit2 /> Edit</button>
              <button onClick={() => deleteHospital(h._id)} className="py-2 px-3 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-all"><FaTrash className="text-red-500 text-xs" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHospitals;
