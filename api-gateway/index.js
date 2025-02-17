require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const expressWs = require('express-ws');
const cors = require('cors');

const app = express();
expressWs(app);

app.use(cors());  // Habilita CORS para todas las rutas

const authServiceProxy = createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/auth': '' },
    onProxyReq: (proxyReq, req, res) => {
      if (req.headers.authorization) {
        proxyReq.setHeader('Authorization', req.headers.authorization);
      }
    },
  });
  
  const inventoryServiceProxy = createProxyMiddleware({
    target: process.env.INVENTORY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/inventory': '' },
    onProxyReq: (proxyReq, req, res) => {
      if (req.headers.authorization) {
        proxyReq.setHeader('Authorization', req.headers.authorization);
      }
    },
  });

  const chatServiceProxy = createProxyMiddleware({
    target: process.env.CHAT_SERVICE_URL,
    ws: true,
    changeOrigin: true,
    pathRewrite: { '^/chat': '' },
    onProxyReq: (proxyReq, req, res) => {
      if (req.headers.authorization) {
        proxyReq.setHeader('Authorization', req.headers.authorization);
      }
    },
  });
  
  app.use('/auth', authServiceProxy);
  app.use('/inventory', inventoryServiceProxy);
  app.use('/chat', chatServiceProxy);
  
  app.get('/', (req, res) => {
    res.send('API Gateway Running');
  });
  
  const PORT = process.env.PORT || 3010;
  app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
  });