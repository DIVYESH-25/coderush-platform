import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [gameState, setGameState] = useState({ currentRound: 0, isRoundActive: false });

  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [teamsRes, stateRes] = await Promise.all([
        api.get('/admin/teams'),
        api.get('/admin/state')
      ]);
      // Verify teams is an array
      if(Array.isArray(teamsRes.data)) setTeams(teamsRes.data);
      if(stateRes.data) setGameState(stateRes.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
         localStorage.removeItem('adminToken');
         navigate('/admin/login');
      }
    }
  };

  const updateState = async (updates) => {
    try {
      const res = await api.post('/admin/state', updates);
      setGameState(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you SURE you want to reset all teams and scores?")) {
      await api.post('/admin/reset');
      fetchData();
    }
  };

  return (
    <div className="fade-in">
      <h2 className="neon-text" style={{ marginBottom: '30px' }}>Admin Dashboard</h2>

      <div className="glass-panel" style={{ marginBottom: '30px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <h3 style={{ marginRight: '20px' }}>Global Controls</h3>
        
        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <span>Current Round: <strong>{gameState.currentRound === 0 ? 'Lobby' : gameState.currentRound}</strong></span>
          <select 
            value={gameState.currentRound} 
            onChange={(e) => updateState({ currentRound: parseInt(e.target.value), isRoundActive: gameState.isRoundActive })}
            style={{ marginLeft: '10px', background: 'var(--bg-panel)', color: 'white', padding: '5px' }}
          >
            <option value={0}>Lobby / Prep</option>
            <option value={1}>Round 1 (MCQ)</option>
            <option value={2}>Round 2 (Debug)</option>
            <option value={3}>Round 3 (Code)</option>
          </select>
        </div>

        <button 
          className={gameState.isRoundActive ? "btn-neon" : "btn-primary"} 
          onClick={() => updateState({ currentRound: gameState.currentRound, isRoundActive: !gameState.isRoundActive })}
        >
          {gameState.isRoundActive ? 'STOP ROUND' : 'START ROUND'}
        </button>

        <button 
          className="btn-neon" 
          onClick={handleReset} 
          style={{ marginLeft: 'auto', color: 'var(--error)', borderColor: 'var(--error)' }}
        >
          RESET EVENT
        </button>
      </div>

      <div className="glass-panel">
        <h3 className="neon-text" style={{ marginBottom: '20px' }}>Live Leaderboard</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--electric-blue)' }}>
                <th style={{ padding: '12px' }}>Rank</th>
                <th style={{ padding: '12px' }}>Team Name</th>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>R1</th>
                <th style={{ padding: '12px' }}>R2</th>
                <th style={{ padding: '12px' }}>R3</th>
                <th style={{ padding: '12px' }}>Total</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={team.teamId} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: index < 3 ? 'var(--cyan)' : 'white' }}>#{index + 1}</td>
                  <td style={{ padding: '12px' }}>{team.teamName}</td>
                  <td style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{team.teamId}</td>
                  <td style={{ padding: '12px' }}>{team.round1Completed ? team.round1Score : '-'}</td>
                  <td style={{ padding: '12px' }}>{team.round2Completed ? team.round2Score : '-'}</td>
                  <td style={{ padding: '12px' }}>{team.round3Completed ? team.round3Score : '-'}</td>
                  <td style={{ padding: '12px', color: 'var(--success)', fontWeight: 'bold' }}>{team.finalScore}</td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      className="btn-neon" 
                      style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                      onClick={() => setSelectedTeam(team)}
                    >
                      DETAILS
                    </button>
                  </td>
                </tr>
              ))}
              {teams.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No teams registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Details Modal */}
      {selectedTeam && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '40px', position: 'relative' }}>
            <button 
              onClick={() => setSelectedTeam(null)}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--error)', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ×
            </button>
            <h2 className="neon-text" style={{ marginBottom: '20px' }}>Team Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', color: 'white' }}>
              <p><strong>Team Name:</strong> {selectedTeam.teamName}</p>
              <p><strong>Team ID:</strong> {selectedTeam.teamId}</p>
              <p><strong>Member 1:</strong> {selectedTeam.member1}</p>
              <p><strong>Member 2:</strong> {selectedTeam.member2}</p>
              <p><strong>College:</strong> {selectedTeam.college}</p>
              <p><strong>Email:</strong> {selectedTeam.email}</p>
              <p><strong>Phone:</strong> {selectedTeam.phone}</p>
              <hr style={{ border: '0.5px solid rgba(0, 243, 255, 0.2)', margin: '10px 0' }} />
              <p><strong>Round 1:</strong> {selectedTeam.round1Score} pts {selectedTeam.round1Completed ? '✅' : '🕑'}</p>
              <p><strong>Round 2:</strong> {selectedTeam.round2Score} pts {selectedTeam.round2Completed ? '✅' : '🕑'}</p>
              <p><strong>Round 3:</strong> {selectedTeam.round3Score} pts {selectedTeam.round3Completed ? '✅' : '🕑'}</p>
              <p style={{ fontSize: '1.2rem', color: 'var(--success)' }}><strong>Total Score:</strong> {selectedTeam.finalScore}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
