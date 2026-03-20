// @desc    Suggest Career based on skills
// @route   POST /api/career/suggest
// @access  Private
const suggestCareer = async (req, res) => {
  try {
    const { skills } = req.body;
    
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: 'Please provide an array of skills' });
    }

    const lowerSkills = skills.map(s => s.toLowerCase());
    
    const rules = [
      { role: 'Frontend Developer', keywords: ['html', 'css', 'javascript', 'react', 'vue', 'tailwind'] },
      { role: 'Backend Developer', keywords: ['node', 'express', 'python', 'java', 'mongodb', 'sql'] },
      { role: 'Data Analyst', keywords: ['python', 'sql', 'excel', 'tableau'] },
      { role: 'DevOps Engineer', keywords: ['docker', 'kubernetes', 'aws', 'linux', 'ci/cd'] }
    ];

    const suggestions = rules.map(rule => {
      const matched = rule.keywords.filter(kw => lowerSkills.includes(kw));
      const matchPercentage = Math.round((matched.length / rule.keywords.length) * 100);
      return {
        role: rule.role,
        matchPercentage,
        matchedSkills: matched,
        missingSkills: rule.keywords.filter(kw => !lowerSkills.includes(kw))
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { suggestCareer };
