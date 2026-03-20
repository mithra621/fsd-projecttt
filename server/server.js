const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: __dirname + '/.env' });
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/career', require('./routes/careerRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
