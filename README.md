# 🚀 CodeRush – Advanced Technical Competition Platform

![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Project-Active-success)

CodeRush is a **comprehensive full-stack coding competition platform** designed for hosting multi-round technical events, hackathons, and coding contests. It provides a seamless experience for participants to register, solve challenges, and track their progress through a live leaderboard, while giving admins full control over the competition flow and evaluation.

---

## 🌟 Key Features

### 👨‍💻 Participant Features
- **Secure Authentication:** Team-based registration and login system.
- **Multi-Round Participation:** Seamless transition between different competition phases.
- **Live Leaderboard:** Real-time ranking updates as participants submit solutions.
- **Responsive Interface:** Fully optimized for both desktop and mobile devices.
- **Timer-based Challenges:** Automatic time tracking for competitive accuracy.

### 👨‍💼 Admin Control Panel
- **Competition Flow Control:** Start, pause, or switch between competition rounds.
- **Real-time Monitoring:** View registered teams and their submission status.
- **Manual Evaluation:** Dedicated tools to review and score Round 2 (debugging) and Round 3 (coding) submissions.
- **Automated Scoring:** Instant calculation for Round 1 (MCQ).
- **Leaderboard Management:** Update rankings automatically after evaluation.

---

## 🏁 Competition Rounds

### Round 1 – MCQ Challenge
Participants answer multiple-choice questions related to programming and computer science fundamentals.
* **Evaluation:** Fully automatic.
* **Scoring:** Instant updates to the leaderboard.

### Round 2 – Debugging Round
Participants are given buggy code snippets and must identify and correct the errors.
* **Total Questions:** 6
* **Time Limit:** 60 Minutes (10 mins per question)
* **Scoring:** 10 Marks per question (Max 60 Marks).
* **Evaluation:** Admin manually reviews corrected code.

### Round 3 – Advanced Coding Round
Participants solve complex algorithmic problems similar to coding interview platforms.
* **Total Questions:** 2
* **Scoring:** 50 Marks per question (Max 100 Marks).
* **Evaluation:** Admin manually evaluates logic and performance.

---

## 🏗️ System Architecture

```text
User Interface (React + Vite)
      ↓ (Axios API Calls)
Backend Server (Node.js + Express)
      ↓ (Mongoose ODM)
Database (MongoDB Atlas)
```

1. **Frontend:** Handles user interaction and displays real-time data.
2. **Backend:** Processes business logic, authentication (JWT), and manages the `codeEvaluator`.
3. **Database:** Stores team data, game state, and competition questions.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Lucide React** (Icons)
- **Axios** (HTTP Client)
- **Monaco Editor** (Code editing experience)

### Backend
- **Node.js & Express.js**
- **MongoDB Atlas** (Cloud Database)
- **Mongoose** (Object Data Modeling)
- **JWT** (Secure Authentication)

### Deployment
- **Render** (Platform as a Service)
- **GitHub** (Version Control)

---

## 📂 Project Structure

```text
coderush-platform/
├── backend/                # Express server & API logic
│   ├── models/             # Mongoose schemas (Team, GameState)
│   ├── routes/             # API endpoints (Auth, Questions, Leaderboard, Admin)
│   ├── middleware/         # Auth & validation logic
│   ├── utils/              # Helper functions & codeEvaluator.js
│   └── server.js           # Main Entry Point
├── frontend/               # React application
│   ├── src/
│   │   ├── pages/          # Dashboard, Rounds, Admin UI
│   │   ├── components/     # Reusable UI elements
│   │   └── App.jsx         # Routing & Main logic
├── mcq_questions.json      # Shared question data
└── package.json            # Root scripts (Monorepo setup)
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB instance

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/DIVYESH-25/coderush-platform.git
cd coderush-platform

# Install dependencies for root, backend, and frontend
npm run install-all
```

### 3. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=securepassword
PORT=5000
```

### 4. Running the Platform
```bash
# Start backend and frontend concurrently
npm start
```
- **Backend:** `http://localhost:5000`
- **Frontend:** `http://localhost:5173`

---

## 🌍 Deployment (Render)

CodeRush is optimized for **Render monorepo deployment**.

1. **Root Directory:** Leave empty.
2. **Build Command:** `npm run build`
3. **Start Command:** `npm run start`
4. **Environment Variables:** Add the variables listed above in the Render dashboard.

---

## 📸 Screenshots
*(Coming Soon)*
- **Login Page** `screenshots/login-page.png`
- **Admin Dashboard** `screenshots/admin-dashboard.png`
- **Leaderboard** `screenshots/leaderboard.png`

---

## 🚀 Future Improvements
- [ ] Automatic code execution sandbox
- [ ] Plagiarism detection system
- [ ] WebSocket integration for instant leaderboard push
- [ ] Email notifications for registered teams
- [ ] Docker containerization

---

## 👨‍💻 Author
**Divyesh S V**
- First Year Engineering Student
- Full Stack Developer | Cloud Computing | Competitive Programmer

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

## ⭐ Support
If you like this project, please consider giving it a **GitHub Star ⭐**. It helps others discover the project!
