const mongoose = require('mongoose');

const resumeDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  extractedText: { type: String },
  score: { type: Number, required: true },
  matchedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  jobRole: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ResumeData', resumeDataSchema);
