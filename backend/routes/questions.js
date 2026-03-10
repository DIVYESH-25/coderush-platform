const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Helper to verify token
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'supersecretcoderushkey_fallback');
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

router.get('/mcq', verifyToken, (req, res) => {
    try {
        const questionsPath = path.join(__dirname, '../../mcq_questions.json');
        const data = fs.readFileSync(questionsPath, 'utf-8');
        const questions = JSON.parse(data);
        // Do not send answers to client
        const safeQuestions = questions.map(q => ({
            id: q.id,
            difficulty: q.difficulty,
            language: q.language,
            question: q.question,
            code: q.code,
            options: q.options
        }));
        res.json(safeQuestions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load questions' });
    }
});

router.post('/mcq/evaluate', verifyToken, (req, res) => {
    try {
        const { answers } = req.body; // array of { id, selected }
        const questionsPath = path.join(__dirname, '../../mcq_questions.json');
        const data = fs.readFileSync(questionsPath, 'utf-8');
        const questions = JSON.parse(data);

        let score = 0;
        answers.forEach(ans => {
            const q = questions.find(question => question.id === ans.id);
            if (q && q.answer === ans.selected) {
                if (q.difficulty === 'Easy') score += 5;
                if (q.difficulty === 'Medium') score += 10;
                if (q.difficulty === 'Hard') score += 15;
            }
        });

        res.json({ score });
    } catch (error) {
        res.status(500).json({ error: 'Evaluation failed' });
    }
});

module.exports = router;
