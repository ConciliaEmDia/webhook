# Webhook Logger

A simple webhook that:
1. Accepts POST requests from any origin
2. Logs request details
3. Responds with current date/time

## Development

```bash
npm install
npm start
```

## Deploy to Netlify

1. Push to GitHub
2. Connect repository to Netlify
3. Deploy using the settings in `netlify.toml`

The webhook will be available at `/.netlify/functions/api`
