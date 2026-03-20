const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume, getResumeData } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getResumeData);

module.exports = router;
