const exp = require('constants');
const express = require('express')
const path = require('path');
const router = express.Router();

// const app = express();
// app.use(express.static(path.join(__dirname, 'public')));

const options = { root: path.join(__dirname, '..', 'public') };

// Home 
router.get('/', (req, res) => {
    res.sendFile('html/index.html', options);
  })

// // Game 
router.get('/play', (req, res) => {
    res.sendFile('html/game.html', options);
});

// // About 
router.get('/about', (req, res) => {
    res.sendFile('html/about.html', options);
})

// Guide
router.get('/guide', (req, res) => {
    res.sendFile('html/guide.html', options);
})

module.exports = router;
