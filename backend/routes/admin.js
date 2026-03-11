const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Team = require('../models/Team');
const GameState = require('../models/GameState');

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'coderushadmin2026';

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'supersecretcoderushkey_fallback', { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretcoderushkey_fallback');
        if (decoded.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Forbidden' });
        }
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Get Global Game State
router.get('/state', verifyAdmin, async (req, res) => {
    const state = await GameState.findOne({ id: 'global' });
    res.json(state);
});

// Update global game state (Start/Stop round)
router.post('/state', verifyAdmin, async (req, res) => {
    const { currentRound, isRoundActive } = req.body;

    let updateFields = { currentRound, isRoundActive };
    if (currentRound === 3 && isRoundActive) {
        updateFields.round3StartTime = new Date();
    }

    const state = await GameState.findOneAndUpdate(
        { id: 'global' },
        { $set: updateFields },
        { new: true, upsert: true }
    );
    res.json(state);
});

// Get all teams
router.get('/teams', verifyAdmin, async (req, res) => {
    const teams = await Team.find({}).sort({ finalScore: -1, round3Score: -1, round2Score: -1 });
    res.json(teams);
});

// Reset competition
router.post('/reset', verifyAdmin, async (req, res) => {
    await Team.deleteMany({});
    await GameState.findOneAndUpdate({ id: 'global' }, { $set: { currentRound: 0, isRoundActive: false } });
    res.json({ message: 'Competition reset' });
});
// Update scores manually
router.post('/update-scores', verifyAdmin, async (req, res) => {
    const { teamId, round2, round3 } = req.body;
    try {
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ error: 'Team not found' });

        if (round2 && Array.isArray(round2)) {
            const r2Scores = round2.map(v => Number(v) || 0);
            for (let s of r2Scores) {
                if (s < 0 || s > 10) return res.status(400).json({ error: 'Round 2 maximum marks per question is 10' });
            }
            team.round2QuestionScores = r2Scores;
            team.round2Score = r2Scores.reduce((a, b) => a + b, 0);
        }

        if (round3 && Array.isArray(round3)) {
            const r3Scores = round3.map(v => Number(v) || 0);
            for (let s of r3Scores) {
                if (s < 0 || s > 50) return res.status(400).json({ error: 'Round 3 maximum marks per problem is 50' });
            }
            team.round3QuestionScores = r3Scores;
            team.round3Score = r3Scores.reduce((a, b) => a + b, 0);
        }

        team.finalScore = (team.round1Score || 0) + (team.round2Score || 0) + (team.round3Score || 0);

        await team.save();
        res.json({ message: 'Scores updated successfully', team });

    } catch (error) {
        res.status(500).json({ error: 'Failed to update scores' });
    }
});

module.exports = router;
