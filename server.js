import express from 'express';
import cors from 'cors';
import https from 'https';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    let bodyContent = req.body;
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
    console.log(JSON.stringify(requestLog, null, 2));
    next();
});

app.post('/', async (req, res) => {
    try {
        console.log('Início Webhook externo.');
        const headersEnviados = {
            'Content-Type': 'application/json',
            ...req.headers
        };
        console.log('Headers enviados para o webhook externo:', headersEnviados);
        console.log('Body enviado:', JSON.stringify(req.body));
        const r = await fetch('https://webhook.homolog.ativa1184.com.br/webhook/d1429e54-893e-4c4d-9fd8-38cdd3091339', {
            method: 'POST',
            headers: headersEnviados,
            body: JSON.stringify(req.body),
            // agent: new https.Agent({ rejectUnauthorized: false }) // use só se necessário
        });
        const responseText = await r.text();
        console.log('Webhook externo chamado com status:', r.status);
        if (r.headers && (typeof r.headers.raw === 'function')) {
            console.log('Headers recebidos do webhook externo:', r.headers.raw());
        } else {
            console.log('Headers recebidos do webhook externo:', r.headers);
        }
        console.log('Resposta do webhook externo:', responseText);
        res.status(r.status).send(responseText);
    } catch (e) {
        console.error('Erro ao encaminhar webhook externo:', e);
        if (e.stack) console.error(e.stack);
        res.status(500).json({ error: 'Erro ao encaminhar webhook externo', details: e.message });
    }
    console.log('Fim Webhook externo.');
});

app.get('/version', (req, res) => {
    res.json({ version: '1.0.0' });
});

const PORT = process.env.PORT || 2999;
app.listen(PORT, () => {
    console.log(`Webhook server listening on port ${PORT}`);
});
