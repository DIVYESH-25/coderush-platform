import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import api from "../api";

const CODING_CHALLENGES = [
  {
    id: 1,
    title: "Data Pipeline Analysis",
    language: "python",
    description:
      `Write a Python function to parse log strings and return the frequency of IP addresses.

Input:
logs = ["192.168.0.1 - GET /home", "192.168.0.1 - POST /login"]

Output:
{
 "192.168.0.1": 2
}`,
    initialCode:
      `def get_ip_frequencies(logs):
    # Write your logic here
    result = {}
    
    for log in logs:
        ip = log.split(" ")[0]
        result[ip] = result.get(ip,0) + 1
    
    return result`
  },

  {
    id: 2,
    title: "Optimized Path Finder",
    language: "java",
    description:
      `Implement a Java method to find the shortest path in a grid
from (0,0) to (n-1,n-1) avoiding obstacles (1).

Return the path length.`,
    initialCode:
      `class Solution {

    public int shortestPath(int[][] grid) {

        // Write your logic here

        return -1;

    }

}`
  }
];

const Round3 = () => {

  const navigate = useNavigate();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [codes, setCodes] = useState(
    CODING_CHALLENGES.map(c => c.initialCode)
  );

  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [isFinished, setIsFinished] = useState(false);

  // Check round state
  useEffect(() => {

    api.get("/round/state").then(res => {

      if (!res.data.isRoundActive || res.data.currentRound !== 3) {
        navigate("/dashboard");
        return;
      }

      if (res.data.round3StartTime) {

        const elapsed =
          Math.floor(
            (Date.now() - new Date(res.data.round3StartTime)) / 1000
          );

        const remaining = (60 * 60) - elapsed;

        setTimeLeft(remaining > 0 ? remaining : 0);
      }

    });

  }, [navigate]);

  // Timer
  useEffect(() => {

    if (isFinished) return;

    if (timeLeft <= 0) {
      handleSubmitAll();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft, isFinished]);

  const handleEditorChange = value => {

    const updated = [...codes];
    updated[currentIdx] = value;
    setCodes(updated);

  };

  const handleSubmitAll = async () => {

    if (isFinished) return;

    setIsFinished(true);

    try {

      await api.post("/round/submit-round", {
        round: 3,
        solutions: codes
      });

      alert("Round 3 submitted successfully! Wait for admin evaluation.");
      navigate("/dashboard");

    } catch (err) {

      console.error(err);
      alert(err.response?.data?.error || "Submission failed");

      setIsFinished(false);

    }

  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (

    <div
      className="fade-in"
      style={{ display: "flex", gap: "20px", height: "80vh" }}
    >

      {/* Left Panel */}
      <div
        className="glass-panel"
        style={{ flex: "0 0 32%", display: "flex", flexDirection: "column" }}
      >

        <h2 style={{ marginBottom: "10px" }}>
          Round 3 : Coding
        </h2>

        <div
          style={{
            fontSize: "1.3rem",
            marginBottom: "15px",
            color: "#00eaff"
          }}
        >
          {mins}:{secs.toString().padStart(2, "0")} remaining
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>

          <button
            onClick={() => setCurrentIdx(0)}
            style={{
              padding: "8px",
              background: currentIdx === 0 ? "#00eaff" : "transparent",
              color: currentIdx === 0 ? "#000" : "#fff",
              border: "1px solid gray"
            }}
          >
            Problem 1
          </button>

          <button
            onClick={() => setCurrentIdx(1)}
            style={{
              padding: "8px",
              background: currentIdx === 1 ? "#00eaff" : "transparent",
              color: currentIdx === 1 ? "#000" : "#fff",
              border: "1px solid gray"
            }}
          >
            Problem 2
          </button>

        </div>

        <h3>
          {CODING_CHALLENGES[currentIdx].title}
        </h3>

        <p
          style={{
            whiteSpace: "pre-wrap",
            color: "#aaa",
            marginTop: "10px",
            lineHeight: "1.5"
          }}
        >
          {CODING_CHALLENGES[currentIdx].description}
        </p>

        <button
          style={{
            marginTop: "auto",
            padding: "10px",
            background: "#00eaff",
            border: "none",
            cursor: "pointer"
          }}
          onClick={() => {
            if (window.confirm("Submit final round?"))
              handleSubmitAll();
          }}
        >
          Submit Round 3
        </button>

      </div>

      {/* Editor Panel */}
      <div
        className="glass-panel"
        style={{ flex: "1", display: "flex", flexDirection: "column" }}
      >

        <Editor
          height="100%"
          language={CODING_CHALLENGES[currentIdx].language}
          theme="vs-dark"
          value={codes[currentIdx]}
          onChange={handleEditorChange}
          options={{
            fontSize: 15,
            minimap: { enabled: false }
          }}
        />

      </div>

    </div>
  );

};

export default Round3;