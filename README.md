# CodeRush - Advanced Technical Competition Platform 🚀

CodeRush is a comprehensive full-stack coding competition platform designed for hosting multi-round technical events. It provides a seamless experience for participants to register, solve challenges, and track their progress through a live leaderboard, while giving admins full control over the competition flow and evaluation.

---

## ✨ Key Features

### 🏁 Multi-Round Competition
- **Round 1 (MCQ Challenge):** Automated multiple-choice questions to test core technical knowledge.
- **Round 2 (Debug & Solve):** Participants identify and fix bugs in code snippets or solve algorithmic problems with automated evaluation.
- **Round 3 (Advanced Problem Solving):** Complex coding challenges evaluated based on performance, accuracy, and edge cases.

### 📊 Real-time Leaderboard
- Dynamic updates as participants submit their answers.
- Intelligent scoring system that calculates points in real-time.
- Visual ranking of all registered teams.

### 🛠️ Admin Dashboard
- **Competition Control:** Start, pause, or switch between competition rounds.
- **Evaluation Tools:** Dedicated interfaces for admins to review and score Round 2 and Round 3 submissions.
- **User Management:** Monitor registered teams and their status.

### 🔐 Secure Authentication
- Group-based registration for teams.
- Secure login for participants and administrators.

---

## 🛠️ Tech Stack

- **Frontend:** [React.js](https://reactjs.org/) (Vite), [Lucide React](https://lucide.dev/) (Icons), [Axios](https://axios-http.com/) (API calls)
- **Backend:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) with [Mongoose](https://mongoosejs.com/) ODM
- **Execution:** Custom `codeEvaluator` for server-side code validation.

---

## 🚀 Setup & Local Development

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB instance

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd coderush-platform
   ```

2. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

3. **Environment Configuration:**
   - Create a `.env` file in the **root** and **backend/** directories.
   - Example configuration:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secure_random_string
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=securepassword
     PORT=5000
     ```

### Running Locally
- **Start Backend and Frontend concurrently:**
  ```bash
  npm start
  ```
  *(Note: Check root package.json for available scripts. Default scripts include `npm run backend` and `npm run frontend`)*

---

## 📂 Project Structure

```text
CODE RUSH/
├── backend/                # Express server & API logic
│   ├── models/             # Mongoose schemas (Team, GameState)
│   ├── routes/             # API endpoints (Auth, Questions, Leaderboard, Admin)
│   ├── utils/              # Helper functions & Code Evaluator
│   └── server.js           # Main entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── pages/          # Landing, Dashboard, Rounds, Admin UI
│   │   ├── components/     # Reusable UI elements
│   │   └── App.jsx         # Main routing logic
├── mcq_questions.json      # Shared question data
└── package.json            # Root configuration & scripts
```

---

## 🌍 Deployment

The platform is pre-optimized for **Render** or similar PaaS providers.

1. **Root Directory:** Leave empty.
2. **Build Command:** `npm run build` (Should build both sectors or individual as per your pipeline).
3. **Start Command:** `npm run start` (Starts the production server from `backend/server.js`).

---

## 🤝 Contributing
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
