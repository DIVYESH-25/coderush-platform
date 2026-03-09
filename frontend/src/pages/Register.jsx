import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamName: '',
    member1: '',
    member2: '',
    college: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return setError('Invalid email format');
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      return setError('Phone number must be 10 digits');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      setSuccess(res.data.message);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('teamId', res.data.teamId);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="neon-text" style={{ textAlign: 'center', marginBottom: '30px' }}>Team Registration</h2>
        
        {error && <div style={{ color: 'var(--error)', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: 'var(--success)', marginBottom: '15px', textAlign: 'center' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <input className="input-neon" type="text" name="teamName" placeholder="Team Name" required onChange={handleChange} />
          <input className="input-neon" type="text" name="member1" placeholder="Member 1 Name" required onChange={handleChange} />
          <input className="input-neon" type="text" name="member2" placeholder="Member 2 Name" required onChange={handleChange} />
          <input className="input-neon" type="text" name="college" placeholder="College Name" required onChange={handleChange} />
          <input className="input-neon" type="email" name="email" placeholder="Email ID" required onChange={handleChange} />
          <input className="input-neon" type="text" name="phone" placeholder="Phone Number (10 digits)" required onChange={handleChange} />
          
          <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Processing...' : 'Register Team'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
