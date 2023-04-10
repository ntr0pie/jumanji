// Requirements
const express = require('express');
// const { initGame, generateGameEvent } = require('../controllers/oaiController');
const generateEvent = require('../controllers/oaiController');

// Router
const router = express.Router()
router.post('/generateEvent', generateEvent); 

module.exports = router;