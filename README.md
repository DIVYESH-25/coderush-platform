# 🚀 CodeRush – Technical Competition Platform

![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Project-Active-success)

CodeRush is a **full-stack coding competition platform** designed for hosting technical events, hackathons, and coding contests in colleges or organizations.

It provides a structured environment where participants can compete through multiple rounds including MCQ, debugging, and coding challenges. The platform includes **automatic scoring, manual evaluation tools for admins, and a real-time leaderboard**.

This project demonstrates a **complete full-stack architecture** with modern technologies and cloud deployment.

---

# 🌟 Key Features

## 👨‍💻 Participant Features

* Secure **Team Registration and Login**
* Participate in multiple competition rounds
* Timer-based rounds
* Submit code solutions
* Real-time score updates
* Live leaderboard rankings
* Mobile responsive interface

---

## 🏁 Competition Rounds

The competition consists of **three rounds**.

---

## Round 1 – MCQ Round

Participants answer multiple-choice questions related to programming and computer science fundamentals.

### Features

* Multiple-choice questions
* Automatic evaluation
* Instant score calculation
* Scores immediately added to leaderboard

---

## Round 2 – Debugging Round

Participants are given **buggy code snippets** and must correct them.

### Rules

* Total Questions: **6**
* Time Limit: **60 minutes**
* Time Per Question: **10 minutes**

Participants submit corrected versions of the code.

### Evaluation

Admin manually reviews the submissions.

### Scoring

Each question carries **10 marks**

Maximum Score:

60 Marks

---

## Round 3 – Coding Round

Participants solve **algorithmic problems** similar to coding interview platforms.

### Rules

* Total Questions: **2**
* Participants write code solutions
* Admin manually evaluates solutions

### Scoring

Each question carries **50 marks**

Maximum Score:

100 Marks

---

# 🏆 Final Score Calculation

Final Score =

Round 1 Score

* Round 2 Score
* Round 3 Score

Leaderboard ranking is automatically calculated based on total score.

---

# 👨‍💼 Admin Dashboard

The platform includes an **Admin Control Panel** that allows organizers to manage the entire competition.

### Admin Capabilities

* Start or stop rounds
* Control competition flow
* View registered teams
* Monitor submissions
* Evaluate Round 2 debugging solutions
* Evaluate Round 3 coding solutions
* Assign marks per question
* Update leaderboard automatically

---

# 📸 Screenshots

(You can add screenshots later by creating a folder called **screenshots** in your repo)

Example:

## Login Page

![Login Page](screenshots/login-page.png)

## Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

## Leaderboard

![Leaderboard](screenshots/leaderboard.png)

## Evaluation Panel

![Evaluation Panel](screenshots/evaluation-page.png)

---

# 🏗️ System Architecture

User
↓
React Frontend (Vite)
↓
Express API Server
↓
MongoDB Atlas Database

### Flow

1. Users interact with the React frontend
2. Axios sends API requests to Express backend
3. Backend processes logic and authentication
4. Data is stored in MongoDB
5. Responses update the UI dynamically

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Axios
* Lucide React Icons
* Monaco Code Editor

---

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication

---

## Deployment

* Render (Hosting)
* GitHub (Version Control)
* MongoDB Atlas (Cloud Database)

---

# 📂 Project Structure

```
coderush-platform/

backend/
│
├── models/
├── routes/
├── middleware/
├── server.js
└── package.json

frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   └── App.jsx
│
├── vite.config.js
└── package.json

mcq_questions.json
package.json
README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the **backend folder**.

Example:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminpassword
PORT=5000
```

---

# 💻 Local Development Setup

## Step 1 — Clone the Repository

```
git clone https://github.com/YOUR_USERNAME/coderush-platform.git
cd coderush-platform
```

---

## Step 2 — Install Dependencies

```
npm run install-all
```

This installs dependencies for:

* Root project
* Backend
* Frontend

---

## Step 3 — Run Backend

```
npm run backend
```

Backend will start at:

```
http://localhost:5000
```

---

## Step 4 — Run Frontend

```
npm run frontend
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🌍 Deployment (Render)

CodeRush supports **monorepo deployment on Render**.

---

## Step 1 — Push Project to GitHub

```
git init
git add .
git commit -m "Initial production commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

---

## Step 2 — Create Render Web Service

Go to:

https://render.com

Create:

New → Web Service

Connect your GitHub repository.

---

## Step 3 — Configure Render

Root Directory:

Leave empty

Build Command:

```
npm run build
```

Start Command:

```
npm run start
```

---

## Step 4 — Add Environment Variables

Add the following:

```
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminpassword
PORT=5000
```

---

# 📊 Leaderboard

The leaderboard dynamically updates based on:

* Round 1 automatic scoring
* Round 2 admin evaluation
* Round 3 admin evaluation

Participants can view rankings in real time during the competition.

---

# 🔐 Security Features

* JWT Authentication
* Protected Admin Routes
* Secure API endpoints
* Team-based login system

---

# 🚀 Future Improvements

* Automatic code execution sandbox
* Plagiarism detection
* WebSocket real-time leaderboard
* Email notifications for participants
* Docker container deployment

---

# 👨‍💻 Author

**Divyesh S V**

First Year Engineering Student
Interested in:

* Full Stack Development
* Cloud Computing
* Competitive Programming

---

# 📜 License

This project is licensed under the **MIT License**.

---

# ⭐ Support

If you like this project, please consider giving it a **GitHub Star ⭐**.
It helps others discover the project.

