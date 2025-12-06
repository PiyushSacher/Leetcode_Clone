# 💻 CodeSphere – Online Coding Platform (LeetCode Clone) 🚀

## 🌟 Overview

CodeSphere is a powerful full-stack online coding platform designed for competitive programming practice and technical interview preparation. Inspired by platforms like LeetCode, it provides an interactive coding environment, problem submissions, real-time evaluation, AI-powered doubt solving, video solutions, and an advanced admin control panel for seamless content management.

## 🔥 Features

- **🔑 User Authentication** (JWT + Cookie-Parser, bcrypt password hashing)
- **📝 Interactive Code Editor** (Monaco Editor for in-browser coding)
- **📚 Problem Management** (Browse, filter & view detailed problems)
- **✅ Code Submission & Evaluation** (Real-time results & storage)
- **🤖 AI Doubt Solver** (Google Generative AI integration)
- **🎥 Video Editorials** (Cloudinary-powered storage & streaming)
- **📊 Submission History** (Track all your previous attempts)
- **🛡️ Admin Panel** (Create/Edit/Delete problems & videos)
- **⚡ Redis Caching** (Fast access to frequently requested data)

## 🛠️ Technologies Used

### 🎨 Frontend:

- React (v19.1.1)
- Vite (v7.1.7)
- Redux Toolkit (v2.9.2) & React Redux (v9.2.0)
- @monaco-editor/react
- Tailwind CSS + DaisyUI
- Axios
- React Router (v7.9.5)

### 🖥️ Backend:

- Node.js & Express.js (v5.1.0)
- MongoDB (v6.20.0) & Mongoose (v8.19.1)
- Redis (v5.8.3)
- JWT + Cookie-Parser
- bcrypt (v6.0.0)
- Google Generative AI (@google/generative-ai, @google/genai)
- Cloudinary (v2.8.0)

## ⚙️ Installation and Setup

### 📌 Prerequisites

Make sure the following are installed:

- Node.js (LTS recommended)
- MongoDB (Local or MongoDB Atlas)
- Redis server (Local or cloud)

### 📥 Clone the Repository

git clone https://github.com/your-username/leetcode_clone.git
cd leetcode_clone

### 📦 Install Dependencies

Since this is a monorepo structure, install dependencies in both backend and frontend folders.

Backend:
```sh
cd backend
npm install
```

Frontend:
```sh
cd ../frontend
npm install
```

### 🔧 Environment Variables

Create a `.env` file inside the **backend** folder:
```sh
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
REDIS_URL=your_redis_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_google_generative_ai_api_key
```

### 🚀 Run the Application

#### 1️⃣ Start Backend:
```sh
cd backend
npm run dev

Backend runs on: http://localhost:5000/
```

#### 2️⃣ Start Frontend:
```sh
cd frontend
npm run dev

Frontend runs on: http://localhost:5173/
```

## 📡 API Endpoints

### 🔑 Authentication

- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login and receive JWT

### 📚 Problems

- `POST /api/problems/upload` – Admin: Upload a new problem
- `GET /api/problems/:id` – Fetch a problem by ID

### 📝 Submissions

- `POST /api/submit` – Submit code for evaluation

### 🤖 AI Assistant

- `POST /api/ai/chat` – Ask the AI Doubt Solver

### 🎥 Video Solutions

- `POST /api/videos/upload` – Admin: Upload video editorial

## 🗄️ Database Structure

The platform uses MongoDB with the following collections:

- **🧑‍💻 Users Collection** – Stores user details, hashed passwords, submission history
- **📜 Problems Collection** – Stores coding challenges, descriptions, test cases
- **💻 Submissions Collection** – Stores submitted code, language, result & timestamps
- **🎥 SolutionVideos Collection** – Stores Cloudinary video URLs and metadata

## 🚢 Deployment

To deploy CodeSphere:

1. Set up MongoDB Atlas & Redis cloud.
2. Configure environment variables on your hosting platform.
3. Deploy backend (Render, DigitalOcean, or Heroku).
4. Deploy frontend (Vercel, Netlify, or via backend static hosting).

