# InterviewAce 🚀

**InterviewAce** is a comprehensive, AI-powered Full-Stack Interview Preparation Portal designed to help users master their tech interviews. Built with the MERN stack (MongoDB, Express, React, Node.js) and powered by the Google Gemini AI Neural Network, this platform provides dynamic mock interviews, automated resume scoring, and interactive coding challenges.

---

## 🔗 Live Demo
- **Frontend (Live):** [https://fsd-projecttt.vercel.app](https://fsd-projecttt.vercel.app)
- **Backend API:** [https://fsd-projecttt-backend.onrender.com](https://fsd-projecttt-backend.onrender.com)

*(Note: The backend is a functional API and does not serve a GUI if you click the backend link directly.)*

---

## 🌟 Key Features
- **User Authentication:** Secure JWT-based registration and login system.
- **AI Mock Interviews:** Practice verbal interviews directly against the Gemini AI Neural Net with dynamic, context-aware feedback.
- **Resume Analyzer:** Upload your resume for mathematical ML scoring and precise career suggestions.
- **Interactive Quizzes:** Take programming quizzes with real-time feedback and progress tracking.
- **Admin Panel:** Specialized dashboard for administrators to manage resources, quizzes, and learning materials.
- **Learning Modules:** Access curated prep materials and skill-specific roadmaps.

---

## 💻 Tech Stack
### **Frontend**
- **Framework:** React.js (via Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Deployment:** Vercel

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JSON Web Tokens (JWT) & bcrypt.js
- **AI Integration:** Google Gemini API
- **Deployment:** Render

### **Database**
- **Database:** MongoDB (Atlas)
- **ODM:** Mongoose

---

## 🛠️ Local Installation & Setup

If you want to run this project locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/mithra621/fsd-projecttt.git
cd fsd-projecttt
```

### 2. Install Dependencies
You will need to install the dependencies for both the `client` and `server` folders.
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Setup Environment Variables
You must create `.env` files in both the `client` and `server` directories.

**In `/server/.env`:**
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key
```

**In `/client/.env`:**
```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the Application locally
Open two separate terminals.

**Terminal 1 (Backend):**
```bash
cd server
npm start
# Server will run on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# Frontend will run on http://localhost:5173 (or similar Vite port)
```

---

## 🚀 Deployment Instructions
This project is configured for cloud deployment.
- **Backend:** Connected to Render.com as a Web Service. Remember to add the environment variables in the Render dashboard and set the Start Command to `npm start`. Ensure your MongoDB Atlas Network Access is set to `0.0.0.0/0`.
- **Frontend:** Deployed to Vercel. Ensure you add `VITE_API_URL` pointing to your live Render backend URL in the Vercel Environment Variables settings.

---

## 📝 License
This project is open-source and available under the [ISC License](LICENSE).
