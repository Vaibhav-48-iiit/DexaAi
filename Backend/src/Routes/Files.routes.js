const express = require('express');
const { searchFiles } = require('../Controllers/Files.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/search', authenticateToken, searchFiles);

module.exports = router;
