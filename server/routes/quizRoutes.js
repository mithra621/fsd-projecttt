const express = require('express');
const router = express.Router();
const { getQuizzes, getQuizById, submitQuiz, seedQuizzes, createQuiz } = require('../controllers/quizController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getQuizzes).post(protect, admin, createQuiz);
router.route('/:id').get(protect, getQuizById);
router.route('/submit').post(protect, submitQuiz);
router.post('/seed', seedQuizzes);

module.exports = router;
