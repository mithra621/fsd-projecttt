const express = require('express');
const router = express.Router();
const { suggestCareer } = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/suggest', protect, suggestCareer);

module.exports = router;
