// server.js

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // v2 (CommonJS-kompatibel)

const app = express();
app.use(cors());

// Proxy-Endpoint für Events
app.get('/api/events', async (req, res) => {
  try {
    // Lese Query-Parameter ndays (Standard: 14)
    const { ndays = 14 } = req.query;

    const response = await fetch(
      `https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?ndays=${ndays}`
    );
    const rawText = await response.text();
    const jsonData = JSON.parse(rawText);
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


app.get('/api/eventsByCategory', async (req, res) => {
  try {
    const { kat, ndays = 14 } = req.query; // Lese kat und ndays
    if (!kat) {
      return res.status(400).json({ success: false, error: 'Missing "kat" parameter' })
    }

    const url = `https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?kat=${kat}&ndays=${ndays}`
    const response = await fetch(url)
    const rawText = await response.text()
    const jsonData = JSON.parse(rawText)

    res.json(jsonData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: error.message })
  }
});

app.get('/api/sehenswuerdigkeiten', async (req, res) => {
  try {
    const url = 'https://geoportal.stadt-koeln.de/arcgis/rest/services/basiskarten/stadtplanthemen/MapServer/7/query?where=objectid%20is%20not%20null&outFields=*&returnGeometry=true&outSR=4326&f=json';
    
    const response = await fetch(url)
    const rawText = await response.text()
    const jsonData = JSON.parse(rawText)

    res.json(jsonData)
  } catch (error) {
    console.error('Fehler beim Abruf der Sehenswürdigkeiten:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Proxy-Server läuft auf Port 3000');
});
