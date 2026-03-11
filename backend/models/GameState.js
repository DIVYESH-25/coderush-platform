const mongoose = require('mongoose');

const GameStateSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, default: 'global' },
    currentRound: { type: Number, default: 0 },
    isRoundActive: { type: Boolean, default: false },
    round3StartTime: { type: Date }
});

module.exports = mongoose.model('GameState', GameStateSchema);
