const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const serverless = require('serverless-http');

// Importando o arquivo de versão
const versionFile = require('../version.json');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Custom logging middleware since we can't write to files in Netlify Functions
app.use((req, res, next) => {
    let bodyContent = req.body;
    
    // Se o body for um Buffer, converte para string e tenta fazer parse como JSON
    if (Buffer.isBuffer(req.body)) {
        try {
            bodyContent = JSON.parse(req.body.toString());
        } catch (e) {
            bodyContent = req.body.toString();
        }
    }
    
    const requestLog = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: bodyContent,
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

// Version endpoint
app.get('/version', (req, res) => {
    res.json({ version: versionFile.version });
});

// Export handler for Netlify Functions
exports.handler = serverless(app);
