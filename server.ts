import express from 'express';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Route for comprehensive IP Geolocation & Network lookup
  app.get('/api/lookup/:ip?', async (req, res) => {
    try {
      let ip = req.params.ip || '';
      if (ip === 'me' || !ip) {
        ip = '';
      }

      // Query ip-api.com for maximum available fields
      const url = `http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,mobile,proxy,hosting,query`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'fail') {
        return res.status(400).json({ error: data.message || 'Falha ao rastrear IP' });
      }

      res.json(data);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erro interno ao consultar IP';
      res.status(500).json({ error: errorMsg });
    }
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
