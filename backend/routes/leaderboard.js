const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

router.get('/', async (req, res) => {
    try {
        const teams = await Team.find({})
            .sort({ finalScore: -1 })
            .select('teamName finalScore -_id'); // Only fetch teamName and finalScore
        res.json(teams);
    } catch (error) {
        console.error("Leaderboard error:", error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

module.exports = router;
