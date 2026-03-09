import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Terminal, LogOut } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('teamId');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const isRoundActive = location.pathname.includes('/round/');

  // Hide nav during active rounds to prevent easy cheating/escape
  if (isRoundActive) return null;

  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-logo">
        <Terminal size={28} color="#00f3ff"/>
        TEXPERIA 2K26 <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>CodeRush</span>
      </Link>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {adminToken ? (
          <>
            <Link to="/admin" className="btn-neon" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Admin Dash</Link>
            <button onClick={handleLogout} className="btn-neon" style={{ padding: '8px 16px', fontSize: '0.8rem', borderColor: 'var(--error)', color: 'var(--error)' }}>
              <LogOut size={16} />
            </button>
          </>
        ) : token ? (
          <>
            <Link to="/dashboard" className="btn-neon" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Dashboard</Link>
            <button onClick={handleLogout} className="btn-neon" style={{ padding: '8px 16px', fontSize: '0.8rem', borderColor: 'var(--error)', color: 'var(--error)' }}>
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <Link to="/register" className="btn-neon" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Register</Link>
            <Link to="/admin/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem' }}>Admin</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
