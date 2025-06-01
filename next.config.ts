import type { NextConfig } from "next";
import { createServer } from 'https';
import { readFileSync } from 'fs';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: readFileSync('./localhost-key.pem'),
  cert: readFileSync('./localhost.pem'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    handle(req, res);
  }).listen(3000, () => {
    console.log('> Ready on https://localhost:3000');
  });
});

const nextConfig: NextConfig = {
  server: {
    https: {
      key: './localhost-key.pem',
      cert: './localhost.pem',
    },
  },
};

export default nextConfig;
