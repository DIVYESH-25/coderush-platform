require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Initialize GameState if it doesn't exist
const initGameState = async () => {
    const state = await db.gameState.findOne({ id: 'global' });
    if (!state) {
        await db.gameState.insert({ id: 'global', currentRound: 0, isRoundActive: false });
    }
};
initGameState();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/round', require('./routes/round'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} (Using NeDB)`));
