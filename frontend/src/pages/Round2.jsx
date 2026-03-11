import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import api from "../api";

const DEBUG_CHALLENGES = [
  {
    id: 1,
    title: "Fix the Array Sum",
    language: "python",
    initialCode:
      `def sum_arr(arr):
    total = 0
    for i in arr:
        total += i
    return total`
  },
  {
    id: 2,
    title: "Fix the Palindrome Check",
    language: "java",
    initialCode:
      `public boolean isPalindrome(String s) {
    for(int i = 0; i < s.length(); i++) {
        if(s.charAt(i) != s.charAt(s.length() - i - 1)) return false;
    }
    return true;
}`
  },
  {
    id: 3,
    title: "Fix the List Filter",
    language: "python",
    initialCode:
      `def filter_even(nums):
    return [x for x in nums if x % 2 == 0]`
  },
  {
    id: 4,
    title: "Fix the String Reverse",
    language: "java",
    initialCode:
      `public String reverse(String s) {
    String rev = "";
    for(int i = s.length() - 1; i >= 0; i--) {
        rev += s.charAt(i);
    }
    return rev;
}`
  },
  {
    id: 5,
    title: "Fix the Factorial",
    language: "python",
    initialCode:
      `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n-1)`
  },
  {
    id: 6,
    title: "Fix the Binary Search",
    language: "java",
    initialCode:
      `public int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;

    while(left <= right) {
        int mid = (left + right) / 2;

        if(arr[mid] == target) return mid;

        if(arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }

    return -1;
}`
  }
];

const Round2 = () => {
  const navigate = useNavigate();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [codes, setCodes] = useState(
    DEBUG_CHALLENGES.map(c => c.initialCode)
  );

  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    api.get("/round/state").then(res => {
      if (!res.data.isRoundActive || res.data.currentRound !== 2) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  // Round timer
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

  const handleNext = () => {
    if (currentIdx < DEBUG_CHALLENGES.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmitAll = async () => {
    if (isFinished) return;

    setIsFinished(true);

    try {
      const res = await api.post("/round/submit-round", {
        round: 2,
        solutions: codes
      }, { timeout: 120000 }); // Increase timeout to 2 mins for evaluation

      console.log("Submission Response Data:", res.data);

      alert(`Round 2 submitted successfully! Wait for admin evaluation.`);
      navigate("/dashboard");

    } catch (err) {
      console.error("[SUBMIT ERROR]", err);
      const errorMsg = err.response?.data?.details || err.message || "Unknown error";
      alert(`Error submitting Round 2: ${errorMsg}`);
      setIsFinished(false);
    }
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", height: "80vh" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}
      >
        <h2>Round 2 : Debugging</h2>

        <div>
          <strong>
            Time Left : {mins}:{secs.toString().padStart(2, "0")}
          </strong>
        </div>
      </div>

      <div
        className="glass-panel"
        style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <h3>
          Challenge {currentIdx + 1} :{" "}
          {DEBUG_CHALLENGES[currentIdx].title}
        </h3>

        <div
          style={{
            flexGrow: 1,
            border: "1px solid #333",
            borderRadius: "6px",
            overflow: "hidden"
          }}
        >
          <Editor
            height="100%"
            language={DEBUG_CHALLENGES[currentIdx].language}
            theme="vs-dark"
            value={codes[currentIdx]}
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              minimap: { enabled: false }
            }}
          />
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <button onClick={handlePrev} disabled={currentIdx === 0}>
            Previous
          </button>

          <button
            onClick={() => {
              if (window.confirm("Submit all solutions?"))
                handleSubmitAll();
            }}
          >
            Submit Round 2
          </button>

          <button
            onClick={handleNext}
            disabled={currentIdx === DEBUG_CHALLENGES.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Round2;