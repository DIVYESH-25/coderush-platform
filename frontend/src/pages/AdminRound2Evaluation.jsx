import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Editor from '@monaco-editor/react';

const AdminRound2Evaluation = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [scores, setScores] = useState([0, 0, 0, 0, 0, 0]);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await api.get('/admin/teams');
            setTeams(res.data);
        } catch (err) {
            if (err.response && err.response.status === 403) {
                navigate('/admin/login');
            }
        }
    };

    const handleViewSubmission = (team) => {
        setSelectedTeam(team);
        // Initialize scores accurately
        const initialScores = [0, 1, 2, 3, 4, 5].map(i => team.round2QuestionScores?.[i] || 0);
        setScores(initialScores);
    };

    const handleScoreChange = (index, value) => {
        const newScores = [...scores];
        newScores[index] = Number(value);
        setScores(newScores);
    };

    const handleSaveScores = async () => {
        try {
            await api.post('/admin/update-scores', {
                teamId: selectedTeam._id,
                round2: scores
            });
            alert('Round 2 scores saved successfully!');
            setSelectedTeam(null);
            fetchTeams();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to save scores');
        }
    };

    if (selectedTeam) {
        const r2Total = scores.reduce((a, b) => a + b, 0);

        return (
            <div className="fade-in" style={{ paddingBottom: '50px' }}>
                <button className="btn-primary" onClick={() => setSelectedTeam(null)} style={{ marginBottom: '20px' }}>
                    &larr; Back to List
                </button>
                <h2 className="neon-text">Evaluating Round 2: {selectedTeam.teamName}</h2>

                {/* Display all 6 solutions */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="glass-panel" style={{ marginTop: '20px' }}>
                        <h3>Question {i + 1}</h3>
                        <div style={{ height: '200px', margin: '15px 0', border: '1px solid var(--electric-blue)' }}>
                            <Editor
                                height="100%"
                                language={i === 1 || i === 3 || i === 5 ? 'java' : 'python'} // Best guess, user can read it anyway
                                theme="vs-dark"
                                value={selectedTeam.round2Solutions?.[i] || 'No submission'}
                                options={{ readOnly: true, minimap: { enabled: false } }}
                            />
                        </div>
                        <div>
                            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Score (0-10):</label>
                            <input
                                type="number"
                                min="0" max="10"
                                value={scores[i]}
                                onChange={(e) => handleScoreChange(i, e.target.value)}
                                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '5px', width: '80px' }}
                            />
                        </div>
                    </div>
                ))}

                <div className="glass-panel" style={{ marginTop: '30px', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '15px' }}>Total Round 2 Score: <span style={{ color: 'var(--success)' }}>{r2Total} / 60</span></h3>
                    <button className="btn-neon" onClick={handleSaveScores} style={{ padding: '10px 40px', fontSize: '1.2rem' }}>
                        SAVE ROUND 2 SCORES
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <button className="btn-primary" onClick={() => navigate('/admin')} style={{ marginBottom: '20px' }}>
                &larr; Back to Dashboard
            </button>
            <h2 className="neon-text" style={{ marginBottom: '30px' }}>Round 2 Evaluation</h2>
            <div className="glass-panel">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--electric-blue)' }}>
                            <th style={{ padding: '12px' }}>Team Name</th>
                            <th style={{ padding: '12px' }}>Round 2 Status</th>
                            <th style={{ padding: '12px' }}>Round 2 Score</th>
                            <th style={{ padding: '12px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map(team => (
                            <tr key={team.teamId} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <td style={{ padding: '12px' }}>{team.teamName}</td>
                                <td style={{ padding: '12px', color: team.round2Completed ? 'var(--success)' : 'var(--text-secondary)' }}>
                                    {team.round2Completed ? 'Submitted' : 'Pending'}
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{team.round2Score || 0}</td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        className="btn-neon"
                                        onClick={() => handleViewSubmission(team)}
                                        disabled={!team.round2Completed}
                                        style={{ opacity: team.round2Completed ? 1 : 0.5 }}
                                    >
                                        View Submission
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminRound2Evaluation;
