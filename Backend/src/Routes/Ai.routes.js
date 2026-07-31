const express = require('express')
const { generateresponse, executeCommand, textToSpeech } = require('../Controllers/Ai.controller')
const { authenticateToken } = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/generate-response', authenticateToken, generateresponse)
router.post('/execute', authenticateToken, executeCommand)
router.post('/tts', authenticateToken, textToSpeech)

module.exports = router
