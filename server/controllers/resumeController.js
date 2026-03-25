const pdfParse = require('pdf-parse');
const ResumeData = require('../models/ResumeData');

// Mock Jobs and their Required Keywords
const jobRoles = {
  'Frontend Developer': ['react', 'javascript', 'html', 'css', 'tailwind', 'redux', 'vue', 'angular', 'web'],
  'Backend Developer': ['node', 'express', 'python', 'java', 'spring', 'sql', 'mongodb', 'api', 'docker'],
  'Data Analyst': ['python', 'sql', 'excel', 'tableau', 'powerbi', 'statistics', 'pandas', 'numpy']
};

// @desc    Upload and Analyze Resume
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Extract text from PDF
    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text.toLowerCase();

    // Import our advanced TF-IDF Machine Learning Engine
    const tfIdfScorer = require('../utils/tfIdfResumeScorer');

    const userSkills = req.user.skills ? req.user.skills.map(s => s.toLowerCase()) : [];
    const combinedText = extractedText + " " + userSkills.join(" ");
    
    let bestRole = 'General Developer';
    let maxScore = 0;
    let finalMatched = [];
    let finalMissing = [];
    
    for (const [role, skills] of Object.entries(jobRoles)) {
      const roleText = skills.join(" ");
      
      // Calculate ML Cosine Similarity using TF-IDF (Returns 0-100)
      const score = tfIdfScorer.calculateScore(combinedText, roleText);
      
      const matched = skills.filter(skill => combinedText.includes(skill));
      
      if (score > maxScore) {
        maxScore = score;
        bestRole = role;
        finalMatched = matched;
        finalMissing = skills.filter(skill => !combinedText.includes(skill));
      }
    }
    
    // Scale the baseline score slightly for better user experience 
    // (TF-IDF strict matching yields natively lower absolute values)
    let score = Math.round(maxScore * 1.8);
    if (score > 100) score = 100;
    if (score < 15 && maxScore > 0) score = 15;

    const resumeData = await ResumeData.create({
      userId: req.user._id,
      extractedText: pdfData.text.substring(0, 500) + '...', // Save first 500 chars 
      score,
      matchedSkills: finalMatched,
      missingSkills: finalMissing,
      jobRole: bestRole
    });

    res.status(201).json(resumeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's past resume analysis
// @route   GET /api/resume
// @access  Private
const getResumeData = async (req, res) => {
  try {
    const resumes = await ResumeData.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadResume, getResumeData };
