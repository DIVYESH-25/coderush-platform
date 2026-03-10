// backend/server.js

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

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Initialize GameState
const initGameState = async () => {
    try {
        const state = await GameState.findOne({ id: 'global' });
        if (!state) {
            await GameState.create({
                id: 'global',
                currentRound: 0,
                isRoundActive: false
            });
            console.log('GameState initialized');
        } else {
            console.log('GameState already exists');
        }
    } catch (err) {
        console.error('Error initializing GameState:', err);
    }
};

// Mongoose v7+ connection fallback to in-memory db
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB');
        initGameState();
    } catch (err) {
        console.error('MongoDB connection error, falling back to In-Memory DB:', err.message);
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
            console.log('Connected to fallback In-Memory MongoDB');
            initGameState();
        } catch (memErr) {
            console.error('Failed to start In-Memory DB:', memErr);
        }
    }
};
connectDB();

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/round', require('./routes/round'));
app.use('/api/admin', require('./routes/admin'));

// Catch-all to serve frontend index.html
app.use((req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Production server running on port ${PORT}`));
