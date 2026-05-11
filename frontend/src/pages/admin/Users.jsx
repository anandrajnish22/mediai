import { useState, useEffect } from 'react';
import { FaUsers, FaUserMd, FaTrash } from 'react-icons/fa';
import { FiSearch, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/users');
      // The backend returns { success: true, data: users }
      setUsers(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
                        (u.email || '').toLowerCase().includes(search.toLowerCase());
    return roleFilter === 'all' ? matchSearch : matchSearch && u.role === roleFilter;
  });

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/admin/users/${id}`, { isActive: !currentStatus });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !currentStatus } : u));
      toast.success('User status updated');
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const roleColors = { patient: 'badge-info', doctor: 'badge-success', admin: 'badge-warning' };

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><FaUsers className="text-primary-500" /> Manage Users</h1>

      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search users..." />
          </div>
          <div className="flex gap-2">
            {['all', 'patient', 'doctor', 'admin'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${roleFilter === r ? 'bg-primary-500 text-white' : 'bg-surface-100 dark:bg-surface-700'}`}>{r}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-700/50">
                <th className="text-left px-6 py-4 text-sm font-semibold">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Joined</th>
                <th className="text-right px-6 py-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user._id} className="border-t border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">{(user.name || '?').charAt(0)}</div>
                      <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-surface-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className={`${roleColors[user.role]} capitalize`}>{user.role}</span></td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleActive(user._id, user.isActive)}
                      className={`w-10 h-5 rounded-full transition-all relative ${user.isActive ? 'bg-green-500' : 'bg-surface-300'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${user.isActive ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <button className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-all"><FiEdit2 className="text-sm" /></button>
                      <button onClick={() => deleteUser(user._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><FaTrash className="text-sm text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
