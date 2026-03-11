// backend/server.js

// 1️⃣ Load environment variables
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const GameState = require("./models/GameState");

const app = express();

console.log("[SERVER] Starting CodeRush Backend...");

// 2️⃣ Middleware
app.use(cors());
app.use(express.json());

// 3️⃣ Serve frontend static files
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// 4️⃣ Initialize GameState
const initGameState = async () => {
    try {
        const state = await GameState.findOne({ id: "global" });

        if (!state) {
            await GameState.create({
                id: "global",
                currentRound: 0,
                isRoundActive: false,
            });

            console.log("✅ GameState initialized");
        } else {
            console.log("ℹ️ GameState already exists");
        }
    } catch (err) {
        console.error("❌ Error initializing GameState:", err);
    }
};

// 5️⃣ Connect to MongoDB Atlas
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in environment variables");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Connected to MongoDB Atlas");

        await initGameState();
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

connectDB();

// 6️⃣ API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/round", require("./routes/round"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/leaderboard", require("./routes/leaderboard"));

// 7️⃣ Catch-all for React routing
app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// 8️⃣ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Production server running on port ${PORT}`);
});

// 9️⃣ Global error handler
app.use((err, req, res, next) => {
    console.error("[GLOBAL ERROR]", err);
    res.status(500).json({
        error: "Internal Server Error",
        details: err.message,
    });
});

// 🔟 Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});