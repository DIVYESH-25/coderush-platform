import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';

// Pages
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Round1 from './pages/Round1';
import Round2 from './pages/Round2';
import Round3 from './pages/Round3';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminRound2Evaluation from './pages/AdminRound2Evaluation';
import AdminRound3Evaluation from './pages/AdminRound3Evaluation';
import Navigation from './components/Navigation';

import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/round/1" element={<Round1 />} />
            <Route path="/round/2" element={<Round2 />} />
            <Route path="/round/3" element={<Round3 />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/eval-round2" element={<AdminRound2Evaluation />} />
            <Route path="/admin/eval-round3" element={<AdminRound3Evaluation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
