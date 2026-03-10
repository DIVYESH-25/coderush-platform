import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', formData);
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Cannot connect to server');
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="neon-text" style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Login</h2>
        {error && <p style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input className="input-neon" type="text" name="username" placeholder="Username" required onChange={handleChange} />
          <input className="input-neon" type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: '10px' }}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
