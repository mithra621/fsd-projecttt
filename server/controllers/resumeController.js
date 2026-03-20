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

    // Import our newly created Machine Learning Engine
    const { getFeatureVector, getCosineSimilarity } = require('../utils/mlEngine');

    const userSkills = req.user.skills ? req.user.skills.map(s => s.toLowerCase()) : [];
    const combinedText = extractedText + " " + userSkills.join(" ");
    
    // ML Feature Selection: Define the vocabulary dimension space across all jobs
    const globalVocabulary = Array.from(new Set(Object.values(jobRoles).flat()));
    
    // Geometrically map the User's Resume into an N-dimensional Vector
    const resumeVector = getFeatureVector(combinedText, globalVocabulary);
    
    let bestRole = 'General Developer';
    let maxSimilarity = 0;
    let finalMatched = [];
    let finalMissing = [];
    
    for (const [role, skills] of Object.entries(jobRoles)) {
      // Map each Job's distinct requirements into the same N-dimensional Space
      const roleText = skills.join(" ");
      const roleVector = getFeatureVector(roleText, globalVocabulary);
      
      // Calculate ML Cosine Similarity
      const similarity = getCosineSimilarity(resumeVector, roleVector);
      
      const matched = skills.filter(skill => combinedText.includes(skill));
      
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        bestRole = role;
        finalMatched = matched;
        finalMissing = skills.filter(skill => !combinedText.includes(skill));
      }
    }
    
    // Normalize the [0.0 - 1.0] scalar into a human readable [0% - 100%] curve
    let score = Math.round(maxSimilarity * 100 * 1.5);
    if (score > 100) score = 100;
    if (score < 15) score = 15;

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
