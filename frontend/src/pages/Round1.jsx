import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Round1 = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Check if round is active
    api.get('/round/state').then(res => {
      if (!res.data.isRoundActive || res.data.currentRound !== 1) {
        navigate('/dashboard');
      }
    });

    api.get('/questions/mcq').then(res => setQuestions(res.data));
  }, [navigate]);

  useEffect(() => {
    if (questions.length === 0 || isFinished) return;

    if (timeLeft === 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, questions, isFinished]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(30);
    } else {
      finishRound();
    }
  };

  const selectOption = (option) => {
    const newAnswers = [...answers];
    const qId = questions[currentIndex].id;
    const existing = newAnswers.find(a => a.id === qId);
    if (existing) existing.selected = option;
    else newAnswers.push({ id: qId, selected: option });
    setAnswers(newAnswers);
  };

  const finishRound = async () => {
    setIsFinished(true);
    try {
      await api.post('/round/submit-round', { round: 1, answers });
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      alert('Error submitting round');
    }
  };

  // Anti-cheat overrides
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleCopy = (e) => e.preventDefault();
    const handleVisibility = () => {
      if (document.hidden) {
        alert("Warning: Tab switching detected! Do not leave the test environment.");
        // Could auto-submit here if strictly enforced, but warning for now.
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  if (questions.length === 0) return <div>Loading questions...</div>;
  if (isFinished) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Submitting...</div>;

  const currentQ = questions[currentIndex];
  const selectedObj = answers.find(a => a.id === currentQ.id);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="neon-text">Round 1: MCQ</h2>
        <div style={{ fontSize: '1.5rem', color: timeLeft <= 5 ? 'var(--error)' : 'var(--success)' }}>
          {timeLeft}s
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.1)', height: '5px', width: '100%', marginBottom: '20px' }}>
        <div style={{ background: 'var(--cyan)', height: '100%', width: `${((currentIndex + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }}></div>
      </div>

      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{currentQ.difficulty} | {currentQ.language}</span>
        </div>

        <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>{currentQ.question}</h3>

        <div style={{ background: '#1e1e1e', padding: '15px', borderRadius: '5px', marginBottom: '20px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          {currentQ.code}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => selectOption(opt)}
              style={{
                padding: '15px',
                background: selectedObj?.selected === opt ? 'rgba(0, 243, 255, 0.2)' : 'transparent',
                border: selectedObj?.selected === opt ? '1px solid var(--electric-blue)' : '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                cursor: 'pointer',
                textAlign: 'left',
                borderRadius: '4px'
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button className="btn-primary" onClick={handleNext}>
            {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Round1;
