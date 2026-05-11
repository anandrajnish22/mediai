import { useState } from 'react';
import { FaHospital, FaMapMarkerAlt, FaPhone, FaAmbulance, FaStar, FaClock } from 'react-icons/fa';
import { FiSearch, FiNavigation } from 'react-icons/fi';

const demoHospitals = [
  { _id: '1', name: 'Apollo Hospital', address: { street: 'Sarita Vihar', city: 'Delhi' }, phone: '011-26925858', rating: 4.5, totalReviews: 1250, departments: ['Cardiology', 'Neurology', 'Orthopedics'], isEmergencyAvailable: true, isOpen24Hours: true, availableBeds: 45, distance: 2.3, description: 'Multi-specialty hospital with world-class facilities' },
  { _id: '2', name: 'AIIMS Hospital', address: { street: 'Ansari Nagar', city: 'Delhi' }, phone: '011-26588500', rating: 4.8, totalReviews: 5200, departments: ['All Departments'], isEmergencyAvailable: true, isOpen24Hours: true, availableBeds: 120, distance: 5.1, description: 'Premier government medical institute' },
  { _id: '3', name: 'Fortis Hospital', address: { street: 'Shalimar Bagh', city: 'Delhi' }, phone: '011-45300000', rating: 4.3, totalReviews: 890, departments: ['Cardiology', 'Oncology', 'Nephrology'], isEmergencyAvailable: true, isOpen24Hours: true, availableBeds: 28, distance: 8.7, description: 'Leading private healthcare provider' },
  { _id: '4', name: 'Max Super Speciality', address: { street: 'Saket', city: 'Delhi' }, phone: '011-26515050', rating: 4.4, totalReviews: 780, departments: ['Cardiology', 'Neurology', 'Urology'], isEmergencyAvailable: true, isOpen24Hours: true, availableBeds: 35, distance: 4.2, description: 'Super speciality hospital' },
  { _id: '5', name: 'Medanta Hospital', address: { street: 'Sector 38', city: 'Gurugram' }, phone: '0124-4141414', rating: 4.7, totalReviews: 2100, departments: ['Heart Institute', 'Neurosciences', 'Bone & Joint'], isEmergencyAvailable: true, isOpen24Hours: true, availableBeds: 80, distance: 15.4, description: 'The Medicity - world-class destination' },
];

const HospitalFinder = () => {
  const [search, setSearch] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = demoHospitals.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) || h.address.city.toLowerCase().includes(search.toLowerCase());
    if (filter === 'emergency') return matchSearch && h.isEmergencyAvailable;
    if (filter === '24hours') return matchSearch && h.isOpen24Hours;
    return matchSearch;
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><FaHospital className="text-primary-500" /> Find Nearby Hospitals</h1>

      {/* Search & Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search hospitals, cities..." />
          </div>
          <div className="flex gap-2">
            {[{ id: 'all', label: 'All' }, { id: 'emergency', label: '🚨 Emergency' }, { id: '24hours', label: '🕐 24 Hours' }].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.id ? 'bg-primary-500 text-white' : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Hospital List */}
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((hospital, i) => (
            <div key={hospital._id} onClick={() => setSelectedHospital(hospital)}
              className={`glass-card p-5 cursor-pointer hover:shadow-card-hover transition-all duration-300 animate-slide-up ${selectedHospital?._id === hospital._id ? 'ring-2 ring-primary-500' : ''}`} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold">{hospital.name}</h3>
                  <p className="text-sm text-surface-500 flex items-center gap-1"><FaMapMarkerAlt className="text-primary-500" /> {hospital.address.street}, {hospital.address.city}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-500"><FaStar /> <span className="font-bold">{hospital.rating}</span></div>
                  <p className="text-xs text-surface-500">{hospital.totalReviews} reviews</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {hospital.departments.slice(0, 3).map(d => <span key={d} className="badge-info text-xs">{d}</span>)}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  {hospital.isEmergencyAvailable && <span className="flex items-center gap-1 text-red-500"><FaAmbulance /> Emergency</span>}
                  {hospital.isOpen24Hours && <span className="flex items-center gap-1 text-green-500"><FaClock /> 24/7</span>}
                </div>
                <span className="flex items-center gap-1 text-primary-600 font-semibold"><FiNavigation /> {hospital.distance} km</span>
              </div>
            </div>
          ))}
        </div>

        {/* Hospital Detail */}
        <div>
          {selectedHospital ? (
            <div className="glass-card p-6 sticky top-20 animate-fade-in">
              <h3 className="text-xl font-bold mb-2">{selectedHospital.name}</h3>
              <p className="text-surface-500 text-sm mb-4">{selectedHospital.description}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm"><FaMapMarkerAlt className="text-primary-500" /> {selectedHospital.address.street}, {selectedHospital.address.city}</div>
                <div className="flex items-center gap-2 text-sm"><FaPhone className="text-green-500" /> {selectedHospital.phone}</div>
                <div className="flex items-center gap-2 text-sm"><FiNavigation className="text-blue-500" /> {selectedHospital.distance} km away</div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedHospital.availableBeds}</p>
                  <p className="text-xs text-surface-500">Available Beds</p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{selectedHospital.rating}</p>
                  <p className="text-xs text-surface-500">Rating</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-sm mb-2">Departments</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedHospital.departments.map(d => <span key={d} className="badge-info text-xs">{d}</span>)}
                </div>
              </div>
              <button className="btn-primary w-full mt-4 text-sm">Book Appointment</button>
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <FaHospital className="text-5xl text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500">Select a hospital to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalFinder;
