// server.js

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // v2 (CommonJS-kompatibel)

const app = express();
app.use(cors());

// Proxy-Endpoint für Events
app.get('/api/events', async (req, res) => {
  try {
    // Bitte HTTPS nutzen, um 301-Redirects zu vermeiden
    const response = await fetch(
      'https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?ndays=14'
    );
    const rawText = await response.text();
    const jsonData = JSON.parse(rawText);
    // jsonData => { success: true, items: [...], count: NN }

    res.json(jsonData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proxy-Endpoint für Kategorien
app.get('/api/categories', async (req, res) => {
  try {
    const response = await fetch(
      'https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?type=listkat'
    );
    const rawText = await response.text();
    const jsonData = JSON.parse(rawText);
    // { success: true, items: [...], count: NN }

    res.json(jsonData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Proxy-Server läuft auf Port 3000');
});
