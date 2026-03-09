import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [gameState, setGameState] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamRes = await api.get('/auth/me');
        setTeam(teamRes.data);
      } catch (err) {
        navigate('/register');
      }
    };
    fetchData();

    // Poll for game state
    const fetchState = async () => {
      try {
        const stateRes = await api.get('/admin/state', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } // If logged in as admin? Wait, we need a public state endpoint
        });
        setGameState(stateRes.data);
      } catch (err) {
        // We will create a public state endpoint next
      }
    };
    
    // We will use a dedicated public endpoint for state. Let's assume we create GET /api/round/state
    const fetchPublicState = async () => {
      try {
         const res = await api.get('/round/state');
         setGameState(res.data);
      } catch(e) {}
    }
    
    fetchPublicState();
    const interval = setInterval(fetchPublicState, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (!team) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading...</div>;

  const handleJoinRound = () => {
    if (gameState?.currentRound > 0) {
      navigate(`/round/${gameState.currentRound}`);
    }
  };

  return (
    <div className="fade-in">
      <h2 className="neon-text" style={{ marginBottom: '30px' }}>Team Dashboard</h2>
      
      <div className="glass-panel" style={{ marginBottom: '30px' }}>
        <h3>{team.teamName} <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>({team.teamId})</span></h3>
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <p><strong>Member 1:</strong> {team.member1}</p>
            <p><strong>Member 2:</strong> {team.member2}</p>
            <p><strong>College:</strong> {team.college}</p>
          </div>
          <div>
            <p><strong>Round 1 Score:</strong> {team.round1Completed ? team.round1Score : 'Pending'}</p>
            <p><strong>Round 2 Score:</strong> {team.round2Completed ? team.round2Score : 'Pending'}</p>
            <p><strong>Round 3 Score:</strong> {team.round3Completed ? team.round3Score : 'Pending'}</p>
            <p className="neon-text" style={{ fontSize: '1.2rem', marginTop: '10px' }}>
              <strong>Total Score:</strong> {team.finalScore}
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '20px' }}>Current Event Status</h3>
        {gameState && gameState.isRoundActive && gameState.currentRound > 0 ? (
           <div>
             <p style={{ color: 'var(--success)', marginBottom: '20px', fontSize: '1.2rem' }}>
               Round {gameState.currentRound} is currently ACTIVE
             </p>
             <button className="btn-primary" onClick={handleJoinRound} style={{ padding: '15px 40px', fontSize: '1.2rem' }}>
               ENTER ROUND {gameState.currentRound}
             </button>
           </div>
        ) : (
           <p style={{ color: 'var(--text-secondary)' }}>Waiting for admin to start the next round...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
