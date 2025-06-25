const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const serverless = require('serverless-http');
const https = require('https');

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
app.post('/', async (req, res) => {
    // Encaminha a requisição para o endpoint externo primeiro
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const agent = new https.Agent({ rejectUnauthorized: false });
    try {
        console.log('Início Webhook externo.');
        const headersEnviados = {
            'Content-Type': 'application/json',
            ...req.headers
        };
        console.log('Headers enviados para o webhook externo:', headersEnviados);
        console.log('Body enviado:', JSON.stringify(req.body));
        const r = await fetch('https://postman-echo.com/post', {
            method: 'POST',
            headers: headersEnviados,
            body: JSON.stringify(req.body),
            agent
        });
        const responseText = await r.text();
        console.log('Webhook externo chamado com status:', r.status);
        if (r.headers && (typeof r.headers.raw === 'function')) {
            console.log('Headers recebidos do webhook externo:', r.headers.raw());
        } else {
            console.log('Headers recebidos do webhook externo:', r.headers);
        }
        console.log('Resposta do webhook externo:', responseText);
        // Retorna ao cliente a resposta do webhook externo
        res.status(r.status).send(responseText);
    } catch (e) {
        console.error('Erro ao encaminhar webhook externo:', e);
        if (e.stack) console.error(e.stack);
        res.status(500).json({ error: 'Erro ao encaminhar webhook externo', details: e.message });
    }
    console.log('Fim Webhook externo.');
});

// Version endpoint
app.get('/version', (req, res) => {
    res.json({ version: versionFile.version });
});

// Export handler for Netlify Functions
exports.handler = serverless(app);
