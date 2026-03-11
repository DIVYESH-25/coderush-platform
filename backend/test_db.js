const mongoose = require('mongoose');
const Team = require('./models/Team');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/coderush", { serverSelectionTimeoutMS: 5000 });
        const lastTeam = await Team.findOne().sort({ createdAt: -1 });
        console.dir(lastTeam.toObject(), { depth: null, colors: true });
        process.exit(0);
    } catch (e) {
        console.error("DB Error:", e.message);
        process.exit(1);
    }
})();
