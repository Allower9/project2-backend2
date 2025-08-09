const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api/data', (req, res) => {
  res.json({ 
    status: 'OK',
    server: process.env.SERVER_NAME || 'Backend-1',
    clientIp: req.ip  // IP клиента (через Nginx)
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
