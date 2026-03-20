const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, enum: ['DSA', 'HR', 'Technical', 'Aptitude', 'Prep', 'Other'] },
  link: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
