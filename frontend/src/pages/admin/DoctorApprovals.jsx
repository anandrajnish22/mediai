import { useState, useEffect } from 'react';
import { FaUserMd, FaCheck, FaTimes, FaBan, FaUndo, FaStethoscope, FaHospital, FaIdCard } from 'react-icons/fa';
import { FiSearch, FiClock, FiCheckCircle, FiXCircle, FiSlash } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DoctorApprovals = () => {
  const [doctors, setDoctors] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, suspended: 0 });
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/doctors?status=${filter}&search=${search}`);
      setDoctors(res.data.data);
      setCounts(res.data.counts);
    } catch (err) {
      // Fallback demo data
      setDoctors([
        { _id: '1', name: 'Dr. Vikram Patel', email: 'vikram@email.com', phone: '+91 98765 43210', specialization: 'Cardiologist', experience: 8, hospitalName: 'Apollo Hospital', medicalLicense: 'MCI-2024-12345', approvalStatus: 'pending', createdAt: new Date().toISOString() },
        { _id: '2', name: 'Dr. Sneha Gupta', email: 'sneha@email.com', phone: '+91 87654 32109', specialization: 'Neurologist', experience: 5, hospitalName: 'AIIMS Delhi', medicalLicense: 'MCI-2024-67890', approvalStatus: 'pending', createdAt: new Date().toISOString() },
      ]);
      setCounts({ pending: 2, approved: 5, rejected: 1, suspended: 0 });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDoctors(); }, [filter, search]);

  const handleAction = async (id, action) => {
    try {
      await api.put(`/admin/doctors/${id}/${action}`);
      toast.success(`Doctor ${action}d successfully!`);
      fetchDoctors();
      setSelectedDoctor(null);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} doctor`);
    }
  };

  const statusTabs = [
    { id: 'pending', label: 'Pending', icon: FiClock, color: 'text-yellow-500', count: counts.pending },
    { id: 'approved', label: 'Approved', icon: FiCheckCircle, color: 'text-green-500', count: counts.approved },
    { id: 'rejected', label: 'Rejected', icon: FiXCircle, color: 'text-red-500', count: counts.rejected },
    { id: 'suspended', label: 'Suspended', icon: FiSlash, color: 'text-orange-500', count: counts.suspended },
  ];

  const statusBadge = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger', suspended: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2.5 py-0.5 rounded-full text-xs font-medium' };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><FaUserMd className="text-primary-500" /> Doctor Approvals</h1>
          <p className="text-surface-500 text-sm mt-1">Review and manage doctor registration requests</p>
        </div>
        {counts.pending > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <FiClock className="text-yellow-500" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{counts.pending} pending</span>
          </div>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {statusTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === tab.id ? 'bg-primary-500 text-white shadow-lg' : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200'}`}>
              <Icon className={filter === tab.id ? 'text-white' : tab.color} />
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${filter === tab.id ? 'bg-white/20 text-white' : 'bg-surface-200 dark:bg-surface-600'}`}>{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search doctors by name..." />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Doctor List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="glass-card p-12 text-center">
              <div className="w-10 h-10 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-surface-500">Loading doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <FaUserMd className="text-5xl text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500 font-medium">No {filter} doctors found</p>
            </div>
          ) : (
            doctors.map((doc, i) => (
              <div key={doc._id} onClick={() => setSelectedDoctor(doc)}
                className={`glass-card p-5 cursor-pointer hover:shadow-card-hover transition-all animate-slide-up ${selectedDoctor?._id === doc._id ? 'ring-2 ring-primary-500' : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                      {doc.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold">{doc.name}</h3>
                      <p className="text-sm text-surface-500">{doc.email}</p>
                    </div>
                  </div>
                  <span className={statusBadge[doc.approvalStatus]}>{doc.approvalStatus}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="flex items-center gap-1 text-xs bg-surface-100 dark:bg-surface-700 px-2.5 py-1 rounded-lg">
                    <FaStethoscope className="text-primary-500" /> {doc.specialization}
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-surface-100 dark:bg-surface-700 px-2.5 py-1 rounded-lg">
                    <FaHospital className="text-green-500" /> {doc.hospitalName}
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-surface-100 dark:bg-surface-700 px-2.5 py-1 rounded-lg">
                    {doc.experience} yrs exp
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {doc.approvalStatus === 'pending' && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); handleAction(doc._id, 'approve'); }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-all shadow-sm">
                        <FaCheck /> Approve
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleAction(doc._id, 'reject'); }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all shadow-sm">
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}
                  {doc.approvalStatus === 'approved' && (
                    <button onClick={(e) => { e.stopPropagation(); handleAction(doc._id, 'suspend'); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-all shadow-sm">
                      <FaBan /> Suspend
                    </button>
                  )}
                  {(doc.approvalStatus === 'rejected' || doc.approvalStatus === 'suspended') && (
                    <button onClick={(e) => { e.stopPropagation(); handleAction(doc._id, 'approve'); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-all shadow-sm">
                      <FaUndo /> Reinstate
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Doctor Detail Panel */}
        <div>
          {selectedDoctor ? (
            <div className="glass-card p-6 sticky top-20 animate-fade-in">
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg">
                  {selectedDoctor.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <h3 className="text-lg font-bold">{selectedDoctor.name}</h3>
                <span className={`inline-block mt-1 ${statusBadge[selectedDoctor.approvalStatus]}`}>{selectedDoctor.approvalStatus}</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                  <p className="text-xs text-surface-500 mb-0.5">Email</p>
                  <p className="font-medium">{selectedDoctor.email}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                  <p className="text-xs text-surface-500 mb-0.5">Phone</p>
                  <p className="font-medium">{selectedDoctor.phone || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                  <p className="text-xs text-surface-500 mb-0.5">Specialization</p>
                  <p className="font-medium flex items-center gap-1"><FaStethoscope className="text-primary-500" /> {selectedDoctor.specialization}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                  <p className="text-xs text-surface-500 mb-0.5">Experience</p>
                  <p className="font-medium">{selectedDoctor.experience} years</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                  <p className="text-xs text-surface-500 mb-0.5">Hospital / Clinic</p>
                  <p className="font-medium flex items-center gap-1"><FaHospital className="text-green-500" /> {selectedDoctor.hospitalName}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                  <p className="text-xs text-surface-500 mb-0.5">Medical License</p>
                  <p className="font-medium flex items-center gap-1"><FaIdCard className="text-blue-500" /> {selectedDoctor.medicalLicense}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                  <p className="text-xs text-surface-500 mb-0.5">Applied On</p>
                  <p className="font-medium">{new Date(selectedDoctor.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <FaUserMd className="text-5xl text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500">Select a doctor to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorApprovals;
