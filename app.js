// Requirements
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const exp = require('constants');


const port = 3000;
const app = express();

// Middleware Functions

// Body parser: json payloads
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// OpenAI API 
app.use('/openai', oaiRouter);

app.listen(post, () => {
    console.log(`Server listening to port [${$port}]`);
})

