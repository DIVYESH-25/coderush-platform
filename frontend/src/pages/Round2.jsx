import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../api';

const DEBUG_CHALLENGES = [
  { id: 1, title: 'Fix the Array Sum', language: 'python', initialCode: 'def sum_arr(arr):\n    total = 0\n    for i in arr:\n    total += i\n        return total', expectedTokens: ['    total += i', '    return total'], points: 15 },
  { id: 2, title: 'Fix the Palindrome Check', language: 'java', initialCode: 'public boolean isPalindrome(String s) {\n  for(int i=0; i<s.length(); i++) {\n    if(s.charAt(i) == s.charAt(s.length() - i)) return false;\n  }\n  return true;\n}', expectedTokens: ['s.length() - i - 1'], points: 15 },
  { id: 3, title: 'Fix the List Filter', language: 'python', initialCode: 'def filter_even(nums):\n    return [x for x in nums if x % 2 = 0]', expectedTokens: ['x % 2 == 0'], points: 15 },
  { id: 4, title: 'Fix the String Reverse', language: 'java', initialCode: 'public String reverse(String s) {\n    String rev = "";\n    for(int i = s.length(); i >= 0; i--) {\n        rev += s.charAt(i);\n    }\n    return rev;\n}', expectedTokens: ['i = s.length() - 1', 'i >= 0'], points: 20 },
  { id: 5, title: 'Fix the Factorial', language: 'python', initialCode: 'def factorial(n):\n    if n == 0:\n        return 0\n    return n * factorial(n-1)', expectedTokens: ['return 1'], points: 15 },
  { id: 6, title: 'Fix the Binary Search', language: 'java', initialCode: 'public int binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length;\n    while(left < right) {\n        int mid = (left + right) / 2;\n        if(arr[mid] == target) return mid;\n        if(arr[mid] < target) left = mid;\n        else right = mid;\n    }\n    return -1;\n}', expectedTokens: ['right = arr.length - 1', 'left <= right', 'left = mid + 1', 'right = mid - 1'], points: 20 },
];

const Round2 = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [codes, setCodes] = useState(DEBUG_CHALLENGES.map(c => c.initialCode));
  const [timeLeft, setTimeLeft] = useState(60 * 60); // Total Round Time: 60 mins
  const [problemTimeLeft, setProblemTimeLeft] = useState(10 * 60); // Per-problem Time: 10 mins
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    api.get('/round/state').then(res => {
      if (!res.data.isRoundActive || res.data.currentRound !== 2) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  // Global Round Timer
  useEffect(() => {
    if (isFinished || timeLeft <= 0) {
      if (!isFinished) handleSubmitAll();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  // Per-Problem Timer
  useEffect(() => {
    if (isFinished || problemTimeLeft <= 0) {
      if (problemTimeLeft <= 0) handleNext();
      return;
    }
    const timer = setInterval(() => setProblemTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [problemTimeLeft, isFinished]);

  // Reset problem timer when moving between questions
  useEffect(() => {
    setProblemTimeLeft(10 * 60);
  }, [currentIdx]);

  const handleEditorChange = (value) => {
    const newCodes = [...codes];
    newCodes[currentIdx] = value;
    setCodes(newCodes);
  };

  const handleNext = () => {
    if (currentIdx < DEBUG_CHALLENGES.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      handleSubmitAll();
    }
  };
  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
  };

  const handleSubmitAll = async () => {
    setIsFinished(true);
    // Mock Evaluation based on expected tokens (heuristic for debugging)
    let totalScore = 0;
    codes.forEach((code, idx) => {
      let problemScore = 0;
      const challenge = DEBUG_CHALLENGES[idx];
      let matches = 0;
      challenge.expectedTokens.forEach(token => {
        if (code.includes(token)) matches++;
      });
      problemScore = (matches / challenge.expectedTokens.length) * challenge.points;
      totalScore += problemScore;
    });
    // Scale to max 100 for round 2
    const finalRoundScore = Math.min(100, Math.round(totalScore * (100 / (DEBUG_CHALLENGES.reduce((a, b) => a + b.points, 0)))));

    try {
      await api.post('/round/submit-round', { round: 2, score: finalRoundScore });
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      alert('Error submitting round 2');
    }
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="neon-text">Round 2: Debugging</h2>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Problem Timer: <span style={{ color: problemTimeLeft <= 60 ? 'var(--error)' : 'var(--cyan)' }}>{Math.floor(problemTimeLeft/60)}:{(problemTimeLeft%60).toString().padStart(2,'0')}</span></div>
          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Round Total: {mins}:{secs.toString().padStart(2, '0')}</div>
        </div>
      </div>

      <div className="glass-panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <h3>Challenge {currentIdx + 1}: {DEBUG_CHALLENGES[currentIdx].title}</h3>
          <span style={{ color: 'var(--text-secondary)' }}>Language: {DEBUG_CHALLENGES[currentIdx].language}</span>
        </div>

        <div style={{ flexGrow: 1, border: '1px solid rgba(0, 243, 255, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
          <Editor
            height="100%"
            language={DEBUG_CHALLENGES[currentIdx].language}
            theme="vs-dark"
            value={codes[currentIdx]}
            onChange={handleEditorChange}
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn-neon" onClick={handlePrev} disabled={currentIdx === 0}>Previous</button>
          
          <button className="btn-primary" onClick={() => { if(window.confirm("Submit all debugging solutions?")) handleSubmitAll() }}>
            Submit Round 2
          </button>
          
          <button className="btn-neon" onClick={handleNext} disabled={currentIdx === DEBUG_CHALLENGES.length - 1}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Round2;
