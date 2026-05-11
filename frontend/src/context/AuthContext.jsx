import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mediai-token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, ...userData } = res.data.data;
    localStorage.setItem('mediai-token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);

    // Doctor registration returns no token (pending approval)
    if (data.role === 'doctor' || !res.data.data.token) {
      return res.data;
    }

    const { token: newToken, ...userData } = res.data.data;
    localStorage.setItem('mediai-token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('mediai-token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    setUser(res.data.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
