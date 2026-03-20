const express = require('express');
const router = express.Router();
const { getResources, seedResources, createResource } = require('../controllers/resourceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getResources).post(protect, admin, createResource);
router.post('/seed', seedResources);

module.exports = router;
