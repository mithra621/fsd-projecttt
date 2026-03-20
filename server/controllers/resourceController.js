const Resource = require('../models/Resource');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public (or semi-private)
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({});
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed some initial resources
// @route   POST /api/resources/seed
// @access  Public (for development)
const seedResources = async (req, res) => {
  try {
    await Resource.deleteMany();
    const seededResources = await Resource.insertMany([
      { title: "Striver's A2Z DSA Sheet", category: 'DSA', link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', description: 'The ultimate 450+ question syllabus covering Data Structures & Algorithms from basics to advanced.' },
      { title: 'GeeksforGeeks Interview Corner', category: 'Technical', link: 'https://www.geeksforgeeks.org/company-interview-corner/', description: 'Company-wise preparation and interview experiences.' },
      { title: 'GeeksforGeeks Complete DSA', category: 'DSA', link: 'https://www.geeksforgeeks.org/data-structures/', description: 'Foundational tutorials on Data Structures and Algorithms by GeeksforGeeks.' },
      { title: 'NeetCode 150', category: 'DSA', link: 'https://neetcode.io/practice', description: 'Curated list of 150 LeetCode problems covering essential algorithmic patterns.' },
      { title: 'Common HR Interview Questions', category: 'HR', link: 'https://www.geeksforgeeks.org/hr-interview-questions-and-answers/', description: 'Top 50 Behavioral and HR questions every engineer should prepare.' },
      { title: 'System Design Primer', category: 'Technical', link: 'https://github.com/donnemartin/system-design-primer', description: 'A massive open-source guide to learning how to design large-scale systems.' },
      { title: 'RS Aggarwal Quantitative Aptitude', category: 'Aptitude', link: 'https://www.geeksforgeeks.org/quantitative-aptitude/', description: 'Comprehensive formulas, shortcuts, and core concepts for passing Preliminary Aptitude rounds.' },
      { title: 'Indiabix Aptitude Practise', category: 'Aptitude', link: 'https://www.indiabix.com/', description: 'Excellent database of numerical, logical, and verbal reasoning questions.' },
      { title: 'The Ultimate Resume Guide', category: 'Prep', link: 'https://www.careercup.com/resume', description: 'How to build an ATS-friendly, single page technical resume that recruiters actually read.' },
      { title: 'LinkedIn Optimization', category: 'Prep', link: 'https://www.freecodecamp.org/news/how-to-optimize-your-linkedin-profile/', description: 'Tips and tricks to ensure recruiters organically find and reach out to you.' }
    ]);
    res.json(seededResources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private/Admin
const createResource = async (req, res) => {
  try {
    const { title, category, link, description } = req.body;
    const resource = await Resource.create({ title, category, link, description });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getResources, seedResources, createResource };
