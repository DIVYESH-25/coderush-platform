const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamId: { type: String, required: true, unique: true },
    teamName: { type: String, required: true, unique: true },
    member1: { type: String, required: true },
    member2: { type: String },
    college: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    round1Score: { type: Number, default: 0 },
    round1Correct: { type: Number, default: 0 },
    round2Solutions: { type: [String], default: [] },
    round2QuestionScores: { type: [Number], default: [] },
    round2Score: { type: Number, default: 0 },
    round3Solutions: { type: [String], default: [] },
    round3QuestionScores: { type: [Number], default: [] },
    round3Score: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
    round1Completed: { type: Boolean, default: false },
    round2Completed: { type: Boolean, default: false },
    round3Completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', TeamSchema);
