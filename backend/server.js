const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Für CORS-Unterstützung

const app = express();
const port = 3000;

// Erlaube CORS für alle Domains (kannst du bei Bedarf einschränken)
app.use(cors());

// ========== ENDPOINT 1: Events ==========
//  -> Ruft Daten auf: https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?kat=...&ndays=7
app.get('/events', async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    const response = await axios.get(
      `https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?kat=${id}&ndays=7`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// ========== ENDPOINT 2: Kategorien ==========
//  -> Ruft Daten auf: https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?type=listkat
app.get('/categories', async (req, res) => {
  try {
    const response = await axios.get(
      'https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?type=listkat'
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
