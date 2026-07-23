const express = require('express')
const { generateresponse, executeCommand } = require('../Controllers/Ai.controller')

const router = express.Router()


router.post('/generate-response', generateresponse)
router.post('/execute', executeCommand)


module.exports = router
