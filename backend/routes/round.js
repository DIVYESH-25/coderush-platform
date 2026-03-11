const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Team = require("../models/Team");
const GameState = require("../models/GameState");
const fs = require("fs");
const path = require("path");
const { evaluateCode } = require("../utils/codeEvaluator");

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        req.user = jwt.verify(
            token,
            process.env.JWT_SECRET || "supersecretcoderushkey_fallback"
        );
        next();
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
};



// ------------------- ROUND STATE -------------------

router.get("/state", async (req, res) => {
    try {
        const state = await GameState.findOne({ id: "global" });

        res.json(
            state || {
                currentRound: 0,
                isRoundActive: false
            }
        );
    } catch (e) {
        res.json({
            currentRound: 0,
            isRoundActive: false
        });
    }
});



// ------------------- SUBMIT ROUND -------------------

router.post("/submit-round", verifyToken, async (req, res) => {

    const teamId = req.user._id;
    const { round, answers, solutions } = req.body;
    const rNum = Number(round);

    console.log(`[SUBMIT] Round: ${rNum}, Team: ${teamId}`);

    try {
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ error: "Team not found" });

        let roundDetails = null;

        // ===================== ROUND 1 =====================
        if (rNum === 1) {
            if (team.round1Completed) {
                return res.status(400).json({ error: "Round 1 already completed" });
            }

            const questionsPath = path.join(__dirname, '..', '..', 'mcq_questions.json');
            const data = fs.readFileSync(questionsPath, "utf-8");
            const questions = JSON.parse(data);

            let correctAnswers = 0;
            if (answers && Array.isArray(answers)) {
                answers.forEach(ans => {
                    const questionId = Number(ans.id);
                    const q = questions.find(question => Number(question.id) === questionId);

                    if (q && q.correctAnswer && ans.selected) {
                        if (String(q.correctAnswer).trim() === String(ans.selected).trim()) {
                            correctAnswers++;
                        }
                    }
                });
            }

            team.round1Score = correctAnswers * 3;
            team.round1Correct = correctAnswers;
            team.round1Completed = true;
        }

        // ===================== ROUND 2 =====================
        else if (rNum === 2) {
            if (team.round2Completed) {
                console.warn(`[SUBMIT] Team ${teamId} already completed Round 2`);
                return res.status(400).json({ error: "Round 2 already completed" });
            }

            if (solutions && Array.isArray(solutions)) {
                team.round2Solutions = solutions;
            }

            team.round2Score = 0; // Admin will evaluate manually
            team.round2Completed = true;

            roundDetails = {
                message: "Round 2 submitted successfully for manual evaluation."
            };
        }

        // ===================== ROUND 3 =====================
        else if (rNum === 3) {
            if (team.round3Completed) {
                console.warn(`[SUBMIT] Team ${teamId} already completed Round 3`);
                return res.status(400).json({ error: "Round 3 already completed" });
            }

            const state = await GameState.findOne({ id: "global" });
            if (state && state.round3StartTime) {
                const elapsedMs = Date.now() - new Date(state.round3StartTime).getTime();
                if (elapsedMs > 3600000) { // 60 minutes + small buffer maybe, but strict is 3600000
                    console.warn(`[SUBMIT] Team ${teamId} Round 3 timeout`);
                    // Even if timeout, let's accept it but log it or reject. Requirements: "System must automatically submit answers."
                    // If frontend submits at 0s, it might be slightly over 3600000, so let's allow graceful submission.
                }
            }
            if (solutions && Array.isArray(solutions)) {
                team.round3Solutions = solutions;
            }
            team.round3Score = 0; // Admin will evaluate manually
            team.round3Completed = true;

            roundDetails = {
                message: "Round 3 submitted successfully for manual evaluation."
            };
        }

        // Update final score and save
        team.finalScore = (Number(team.round1Score) || 0) +
            (Number(team.round2Score) || 0) +
            (Number(team.round3Score) || 0);

        await team.save();

        const response = {
            message: `Round ${rNum} submitted successfully`,
            team: team.toObject(),
            score: roundDetails ? roundDetails.score : 0,
            passedTests: roundDetails ? roundDetails.passedTests : 0,
            totalTests: roundDetails ? roundDetails.totalTests : 0
        };
        console.log(`[RESPONSE] Sent:`, response);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to submit round" });
    }
});



module.exports = router;