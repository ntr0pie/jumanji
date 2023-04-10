// Requirements
const dotenv = require('dotenv').config();
const path = require('path');
const express = require('express');
const oaiRouter = require('./routes/oaiRouter');
const optionsRouter = require('./routes/optionsRouter');

const port = 3000;
const app = express();

//// Middleware Functions
// Body parser: json payloads
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Frontend static assets
app.use(express.static(path.join(__dirname, 'public')));

// Routers
// OpenAI (GPT and Dall-E API)
app.use('/openai', oaiRouter);

// Menu
app.use('/', optionsRouter);

app.listen(port, () => {
    console.log(`Server listening to port [${port}]`);
})

