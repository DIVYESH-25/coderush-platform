require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const GameState = require('./models/GameState');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serving Frontend Static Files in Production
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        initGameState();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Initialize GameState if it doesn't exist
const initGameState = async () => {
    try {
        const state = await GameState.findOne({ id: 'global' });
        if (!state) {
            await GameState.create({ id: 'global', currentRound: 0, isRoundActive: false });
        }
    } catch (err) {
        console.error('Error initializing GameState:', err);
    }
};

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/round', require('./routes/round'));
app.use('/api/admin', require('./routes/admin'));

// Catch-all to serve frontend index.html for SPA routing
app.use((req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Production server running on port ${PORT}`));
