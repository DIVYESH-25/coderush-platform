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
    const state = await GameState.findOneAndUpdate(
        { id: 'global' },
        { $set: { currentRound, isRoundActive } },
        { new: true, upsert: true }
    );
    res.json(state);
});

// Get all teams
router.get('/teams', verifyAdmin, async (req, res) => {
    const teams = await Team.find({}).sort({ finalScore: -1 });
    res.json(teams);
});

// Reset competition
router.post('/reset', verifyAdmin, async (req, res) => {
    await Team.deleteMany({});
    await GameState.findOneAndUpdate({ id: 'global' }, { $set: { currentRound: 0, isRoundActive: false } });
    res.json({ message: 'Competition reset' });
});

module.exports = router;
