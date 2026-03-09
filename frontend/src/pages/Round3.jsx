import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../api';

const CODING_CHALLENGES = [
  { id: 1, title: 'Data Pipeline Analysis', language: 'python', description: 'Write a Python function to parse a log file string and return the frequency of all IP addresses. Wait for the list of strings and process them.\n\nInput: log = "192.168.0.1 - GET /", etc.\nOutput: Dictionary', initialCode: 'def get_ip_frequencies(logs):\n    # Write your logic here\n    pass' },
  { id: 2, title: 'Optimized Path Finder', language: 'java', description: 'Implement a Java method to find the shortest path in a 2D matrix from (0,0) to (N-1, N-1) avoiding obstacles (1s).\n\nInput: int[][] grid\nOutput: int shortestPathLength', initialCode: 'class Solution {\n    public int shortestPath(int[][] grid) {\n        // Write logic here\n        return -1;\n    }\n}' },
];

const Round3 = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [codes, setCodes] = useState(CODING_CHALLENGES.map(c => c.initialCode));
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120 mins
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    api.get('/round/state').then(res => {
      if (!res.data.isRoundActive || res.data.currentRound !== 3) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  useEffect(() => {
    if (isFinished || timeLeft <= 0) {
      if (!isFinished) handleSubmitAll();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleEditorChange = (value) => {
    const newCodes = [...codes];
    newCodes[currentIdx] = value;
    setCodes(newCodes);
  };

  const handleSubmitAll = async () => {
    setIsFinished(true);
    // Mock Evaluation for Round 3: Check purely on code length/keywords as a mock representation of AI evaluate requirement Since we don't have an AI endpoint.
    // 50 marks for syntactic keywords, 50 marks for standard structure.
    let totalScore = 0;
    
    // P1 mock score (max 100):
    let p1Score = codes[0].length > 50 ? 50 : codes[0].length;
    if (codes[0].includes('for') || codes[0].includes('dict') || codes[0].includes('split')) p1Score += 50;
    
    // P2 mock score (max 100):
    let p2Score = codes[1].length > 100 ? 50 : codes[1].length / 2;
    if (codes[1].includes('Queue') || codes[1].includes('bfs') || codes[1].includes('LinkedList')) p2Score += 50;

    const finalScore = (Math.min(100, p1Score) + Math.min(100, p2Score)) / 2;

    try {
      await api.post('/round/submit-round', { round: 3, score: Math.round(finalScore) });
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      alert('Error submitting round 3');
    }
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="fade-in" style={{ display: 'flex', gap: '20px', height: '80vh' }}>
      
      {/* Problem Description Panel */}
      <div className="glass-panel" style={{ flex: '0 0 30%', display: 'flex', flexDirection: 'column' }}>
         <h2 className="neon-text" style={{ marginBottom: '10px' }}>Round 3: Final Code</h2>
         <div style={{ marginBottom: '20px', fontSize: '1.2rem', color: 'var(--success)' }}>
          {mins}:{secs.toString().padStart(2, '0')} remaining
         </div>

         <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
           <button 
              onClick={() => setCurrentIdx(0)} 
              className={currentIdx === 0 ? "btn-neon" : ""} 
              style={currentIdx === 0 ? {} : {background:'transparent', border:'1px solid gray', color:'white', padding:'8px'}}
            >
             Problem 1 (Py)
           </button>
           <button 
              onClick={() => setCurrentIdx(1)} 
              className={currentIdx === 1 ? "btn-neon" : ""}
              style={currentIdx === 1 ? {} : {background:'transparent', border:'1px solid gray', color:'white', padding:'8px'}}
            >
             Problem 2 (Java)
           </button>
         </div>

         <h3>{CODING_CHALLENGES[currentIdx].title}</h3>
         <p style={{ marginTop: '15px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
           {CODING_CHALLENGES[currentIdx].description}
         </p>

         <button className="btn-primary" style={{ marginTop: 'auto' }} onClick={() => { if(window.confirm("Submit final round?")) handleSubmitAll() }}>
            Submit Challenge
         </button>
      </div>

      {/* Editor Panel */}
      <div className="glass-panel" style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '10px' }}>
        <Editor
            height="100%"
            language={CODING_CHALLENGES[currentIdx].language}
            theme="vs-dark"
            value={codes[currentIdx]}
            onChange={handleEditorChange}
            options={{ fontSize: 16, minimap: { enabled: false } }}
          />
      </div>

    </div>
  );
};

export default Round3;
