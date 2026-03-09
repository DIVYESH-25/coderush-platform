const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Team = require('../models/Team');
const GameState = require('../models/GameState');

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Public endpoint to get round status
router.get('/state', async (req, res) => {
    try {
        const state = await GameState.findOne({ id: 'global' });
        res.json(state || { currentRound: 0, isRoundActive: false });
    } catch (e) {
        res.json({ currentRound: 0, isRoundActive: false });
    }
});

// Start or move to next round (team level)
router.post('/submit-round', verifyToken, async (req, res) => {
    const { round, score } = req.body;
    const teamId = req.user._id;

    try {
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ error: 'Team not found' });

        if (round === 1) {
            team.round1Score = score;
            team.round1Completed = true;
        } else if (round === 2) {
            team.round2Score = score;
            team.round2Completed = true;
        } else if (round === 3) {
            team.round3Score = score;
            team.round3Completed = true;
        }

        // Calculate final score
        team.finalScore = (team.round1Score || 0) + (team.round2Score || 0) + (team.round3Score || 0);

        await team.save();

        res.json({ message: `Round ${round} submitted`, team });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit round' });
    }
});

module.exports = router;
