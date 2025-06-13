const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const serverless = require('serverless-http');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Custom logging middleware since we can't write to files in Netlify Functions
app.use((req, res, next) => {    const requestLog = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: typeof req.body === 'object' ? req.body : JSON.parse(req.body),
        ip: req.ip
    };
    
    // Log to Netlify's function logs
    console.log(JSON.stringify(requestLog, null, 2));
    next();
});

// Webhook route
app.post('/', (req, res) => {
    const dataHora = new Date().toISOString();
    res.json({ dataHora });
});

// Export handler for Netlify Functions
exports.handler = serverless(app);
