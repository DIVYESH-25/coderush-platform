# CodeRush - Technical Competition Platform 🚀

CodeRush is a full-stack coding competition platform built for technical events. It features multiple rounds, real-time leaderboard, and an admin dashboard for controlling the competition.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Axios, Lucide React
- **Backend:** Node.js, Express, Mongoose (MongoDB)
- **Deployment:** Render / GitHub

---

## 🚀 Setup & Local Development

### Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas URI

### Installation
1. Clone the repository and navigate to the project root.
2. Install all dependencies:
   ```bash
   npm run install-all
   ```

### Running Locally
1. Configure your `.env` file in the root (based on `.env.example`).
2. Run backend and frontend concurrently:
   - For Backend: `npm run backend` (Starts on port 5000)
   - For Frontend: `npm run frontend` (Starts on Vite dev server)

---

## 🌍 Deployment on Render

This project is pre-configured for **Render** monorepo deployment.

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial production commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 2. Deploy on Render
1. **New Web Service**:
   - **Root Directory**: Leave empty (root)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
2. **Environment Variables**:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Random secure string
   - `ADMIN_USERNAME`: Your choice
   - `ADMIN_PASSWORD`: Your choice
   - `PORT`: 5000

---

## 📂 Project Structure
- `backend/`: Express server, Mongoose models, and API routes.
- `frontend/`: React source code and Vite configuration.
- `mcq_questions.json`: Sample questions shared between rounds.

---

## 📜 License
MIT
