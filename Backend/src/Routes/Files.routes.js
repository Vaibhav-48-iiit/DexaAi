const express = require('express');
const { searchFiles } = require('../Controllers/Files.controller');

const router = express.Router();

router.post('/search', searchFiles);

module.exports = router;
