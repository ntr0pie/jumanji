// Requirements
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const exp = require('constants');
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
// app.use('/openai', oaiRouter);

// Menu
app.use('/', optionsRouter);

app.listen(port, () => {
    console.log(`Server listening to port [${port}]`);
})

