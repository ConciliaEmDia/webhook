const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Criar diretório de logs se não existir
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Configurar stream de log para arquivo
const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
);

// Middlewares
app.use(cors()); // Permitir acesso de qualquer origem
app.use(express.json()); // Parser para JSON
app.use(morgan('combined', { stream: accessLogStream })); // Log de requisições

// Rota do webhook
app.post('/', (req, res) => {
    const dataHora = new Date().toISOString();
    
    // Log detalhado da requisição em um arquivo separado
    const requestLog = {
        timestamp: dataHora,
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        ip: req.ip
    };

    fs.writeFileSync(
        path.join(logsDir, `request-${Date.now()}.json`),
        JSON.stringify(requestLog, null, 2)
    );

    // Responder com a data/hora atual
    res.json({ dataHora });
});

app.listen(port, () => {
    console.log(`Webhook server running on port ${port}`);
});
