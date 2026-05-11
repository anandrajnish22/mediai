import { useState } from 'react';
import { FaFileMedical, FaFilePdf, FaFileImage, FaUpload } from 'react-icons/fa';
import { FiSearch, FiDownload, FiTrash2, FiShare2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const demoRecords = [
  { _id: '1', title: 'Complete Blood Count', category: 'blood_test', createdAt: '2024-12-15', fileType: 'pdf', description: 'Annual blood work results' },
  { _id: '2', title: 'Chest X-Ray Report', category: 'xray', createdAt: '2024-12-10', fileType: 'image', description: 'Routine chest examination' },
  { _id: '3', title: 'Dr. Sharma Prescription', category: 'prescription', createdAt: '2024-12-08', fileType: 'pdf', description: 'Cardiology consultation prescription' },
  { _id: '4', title: 'Lipid Profile Test', category: 'lab_report', createdAt: '2024-11-28', fileType: 'pdf', description: 'Cholesterol and triglyceride levels' },
];

const categories = [
  { id: 'all', label: 'All Records' }, { id: 'blood_test', label: 'Blood Tests' }, { id: 'xray', label: 'X-Rays' },
  { id: 'prescription', label: 'Prescriptions' }, { id: 'lab_report', label: 'Lab Reports' }, { id: 'other', label: 'Other' }
];

const HealthRecords = () => {
  const [records] = useState(demoRecords);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  const filtered = records.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return category === 'all' ? matchSearch : matchSearch && r.category === category;
  });

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><FaFileMedical className="text-primary-500" /> Health Records</h1>
        <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2 text-sm"><FaUpload /> Upload</button>
      </div>

      {/* Search & Categories */}
      <div className="glass-card p-4 mb-6">
        <div className="relative mb-3">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search records..." />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${category === c.id ? 'bg-primary-500 text-white' : 'bg-surface-100 dark:bg-surface-700'}`}>{c.label}</button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((record, i) => (
          <div key={record._id} className="glass-card p-5 hover:shadow-card-hover transition-all animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                {record.fileType === 'pdf' ? <FaFilePdf className="text-red-500 text-xl" /> : <FaFileImage className="text-blue-500 text-xl" />}
              </div>
              <span className="badge-info text-xs capitalize">{record.category.replace('_', ' ')}</span>
            </div>
            <h3 className="font-bold text-sm mb-1">{record.title}</h3>
            <p className="text-xs text-surface-500 mb-3">{record.description}</p>
            <p className="text-xs text-surface-400 mb-3">{new Date(record.createdAt).toLocaleDateString()}</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-xs font-medium hover:bg-primary-50 transition-all flex items-center justify-center gap-1"><FiDownload /> Download</button>
              <button className="py-2 px-3 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-blue-50 transition-all"><FiShare2 className="text-sm" /></button>
              <button onClick={() => toast.success('Deleted')} className="py-2 px-3 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-red-50 transition-all"><FiTrash2 className="text-sm text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card !bg-white dark:!bg-surface-800 p-6 w-full max-w-md animate-slide-up">
            <h2 className="text-xl font-bold mb-4">Upload Medical Record</h2>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Title</label><input className="input-field mt-1" placeholder="Record title" /></div>
              <div><label className="text-sm font-medium">Category</label>
                <select className="input-field mt-1">{categories.slice(1).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
              </div>
              <div><label className="text-sm font-medium">Description</label><textarea className="input-field mt-1" rows={2} /></div>
              <div className="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 transition-all">
                <FaUpload className="text-3xl text-surface-400 mx-auto mb-2" />
                <p className="text-sm text-surface-500">Click or drag files to upload</p>
                <p className="text-xs text-surface-400 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowUpload(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
                <button onClick={() => { setShowUpload(false); toast.success('Uploaded!'); }} className="btn-primary flex-1 text-sm">Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;
