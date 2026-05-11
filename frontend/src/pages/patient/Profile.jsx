import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    bloodGroup: user?.bloodGroup || '', weight: user?.weight || '', height: user?.height || '',
    allergies: user?.allergies?.join(', ') || '',
    address: { city: user?.address?.city || '', state: user?.address?.state || '' }
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setForm(p => ({ ...p, [parent]: { ...p[parent], [child]: value } }));
    } else setForm(p => ({ ...p, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ ...form, allergies: form.allergies.split(',').map(a => a.trim()).filter(Boolean), weight: Number(form.weight), height: Number(form.height) });
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><FiUser className="text-primary-500" /> My Profile</h1>

      {/* Avatar */}
      <div className="glass-card p-6 mb-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-3xl text-white font-bold shadow-lg">{user?.name?.charAt(0) || 'U'}</div>
        <div>
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="text-surface-500">{user?.email}</p>
          <span className="badge-info mt-1 capitalize">{user?.role}</span>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Full Name</label><input value={form.name} onChange={e => handleChange('name', e.target.value)} className="input-field mt-1" /></div>
          <div><label className="text-sm font-medium">Phone</label><input value={form.phone} onChange={e => handleChange('phone', e.target.value)} className="input-field mt-1" /></div>
          <div><label className="text-sm font-medium">Date of Birth</label><input type="date" value={form.dateOfBirth} onChange={e => handleChange('dateOfBirth', e.target.value)} className="input-field mt-1" /></div>
          <div><label className="text-sm font-medium">Gender</label>
            <select value={form.gender} onChange={e => handleChange('gender', e.target.value)} className="input-field mt-1">
              <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
            </select>
          </div>
          <div><label className="text-sm font-medium">Blood Group</label>
            <select value={form.bloodGroup} onChange={e => handleChange('bloodGroup', e.target.value)} className="input-field mt-1">
              <option value="">Select</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div><label className="text-sm font-medium">Weight (kg)</label><input type="number" value={form.weight} onChange={e => handleChange('weight', e.target.value)} className="input-field mt-1" /></div>
          <div><label className="text-sm font-medium">Height (cm)</label><input type="number" value={form.height} onChange={e => handleChange('height', e.target.value)} className="input-field mt-1" /></div>
          <div><label className="text-sm font-medium">Allergies</label><input value={form.allergies} onChange={e => handleChange('allergies', e.target.value)} className="input-field mt-1" placeholder="Comma separated" /></div>
          <div><label className="text-sm font-medium">City</label><input value={form.address.city} onChange={e => handleChange('address.city', e.target.value)} className="input-field mt-1" /></div>
          <div><label className="text-sm font-medium">State</label><input value={form.address.state} onChange={e => handleChange('address.state', e.target.value)} className="input-field mt-1" /></div>
        </div>
        <button onClick={handleSave} disabled={loading} className="btn-primary mt-6 flex items-center gap-2">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave /> Save Changes</>}
        </button>
      </div>
    </div>
  );
};

export default Profile;
