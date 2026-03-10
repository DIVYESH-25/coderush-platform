const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Team = require('../models/Team');

router.post('/register', async (req, res) => {
    try {
        const { teamName, member1, member2, college, email, phone } = req.body;

        // Check if team already exists
        const existingTeam = await Team.findOne({ teamName });
        if (existingTeam) {
            return res.status(400).json({ error: 'Team name already exists' });
        }

        // Generate unique Team ID
        const count = await Team.countDocuments({});
        const teamId = `CR-${100 + count + 1}`;

        const newTeam = new Team({
            teamId,
            teamName,
            member1,
            member2,
            college,
            email,
            phone
        });

        const insertedTeam = await newTeam.save();

        const jwtSecret = process.env.JWT_SECRET || 'supersecretcoderushkey_fallback';
        const token = jwt.sign({ teamId, _id: insertedTeam._id }, jwtSecret, { expiresIn: '12h' });

        res.status(201).json({ message: 'Registration Successful - Welcome to CodeRush', teamId, token });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Get team profile
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'No token provided' });
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretcoderushkey_fallback');
        
        const team = await Team.findById(decoded._id);
        if (!team) return res.status(404).json({ error: 'Team not found' });
        
        res.status(200).json(team);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;
