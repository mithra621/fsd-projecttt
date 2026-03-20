# Interview Ace - Interview Preparation Portal

A production-ready full-stack web application designed to help users prepare for technical and HR interviews. It features resources, MCQ quizzes with timers, an AI-powered resume analyzer, and a career path suggestion engine.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, React Router, Chart.js
- **Backend**: Node.js, Express.js, Multer (file upload), PDF-Parse 
- **Database**: MongoDB Atlas, Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Features
- **Authentication**: Secure Login & Registration using JWT
- **Dark Mode**: Integrated Tailwind dark mode context.
- **Preparation Resources**: Filterable and searchable DSA, HR, and Technical resources.
- **Practice Quizzes**: Configurable MCQs with countdown timers and automatic grading.
- **AI Resume Analyzer**: Upload a PDF resume. The backend parses the PDF and uses a keyword-matching ML mock engine to score the resume and suggest missing skills for specific job roles.
- **Career Suggestions**: Enter your current skills to get role recommendations and learning roadmaps based on a rule-based engine.
- **Progress Dashboard**: View chart-based analytics of your mock interview performance and resume score progression.

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB Atlas cluster connection string

### 2. Environment Variables
In the `server` directory, create a `.env` file (if not automatically created) with:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Installation
Run the root install script to install all dependencies for both frontend and backend:
```bash
npm run install-all
```

### 4. Running the Application
To run both the React frontend and the Express backend concurrently:
```bash
npm run dev
```
- Client runs at: `http://localhost:5173`
- Server APIs at: `http://localhost:5000`

### 5. Seeding the Database
To populate the database with dummy quizzes and resources, send a POST request (e.g., using Postman or curl) to:
- `POST http://localhost:5000/api/resources/seed`
- `POST http://localhost:5000/api/quiz/seed`

## Deployment Guidelines

### 1. Backend on Render
- Push your code to GitHub.
- On Render, create a new "Web Service" and connect your repo.
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**: Add `MONGO_URI`, `JWT_SECRET`, and `PORT`.

### 2. Frontend on Netlify
- On Netlify, create a new site from GitHub.
- **Base Directory**: `client`
- **Build Command**: `npm run build`
- **Publish Directory**: `client/dist`
- Add Netlify specific redirect rules for React Router by creating `client/public/_redirects` with: `/* /index.html 200`.
- Update `client/src/api` or axios base URLs to point to your deployed Render URL instead of `localhost:5000`.

### 3. MongoDB Atlas Connection
Whitelist IP addresses `0.0.0.0/0` in MongoDB Atlas Network Access so Render can connect to your database.
