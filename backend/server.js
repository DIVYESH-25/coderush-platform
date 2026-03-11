// backend/server.js

// 1️⃣ Load environment variables from backend/.env
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const GameState = require('./models/GameState');

const app = express();
console.log("[SERVER] Starting CodeRush Backend...");

// Middleware
app.use(cors());
app.use(express.json());

// 2️⃣ Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// 3️⃣ Initialize GameState
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

// 4️⃣ Connect to MongoDB Atlas
const connectDB = async () => {
    const startMemoryDB = async () => {
        try {
            // Fallback: In-Memory DB (for development/testing only)
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
            console.log('✅ Connected to fallback In-Memory MongoDB');
            initGameState();
        } catch (memErr) {
            console.error('❌ Failed to start In-Memory DB:', memErr);
        }
    };

    if (!process.env.MONGO_URI) {
        console.warn('⚠️ MONGO_URI is undefined. Activating fallback In-Memory Database immediately.');
        return startMemoryDB();
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected to MongoDB Atlas');
        initGameState();
    } catch (err) {
        console.error('❌ MongoDB connection error, falling back to In-Memory DB:', err.message);
        startMemoryDB();
    }
};
connectDB();

// 5️⃣ API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/round', require('./routes/round'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// 6️⃣ Catch-all: Serve frontend index.html for SPA routing
app.use((req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// 7️⃣ Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 Production server running on port ${PORT}`));

// Global error handler
app.use((err, req, res, next) => {
    console.error("[GLOBAL ERROR]", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});