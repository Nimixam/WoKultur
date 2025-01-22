const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// Middleware für Fehlerprotokollierung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Endpunkt: Veranstaltungen
app.get('/events', async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?kat=${req.query.id}&ndays=${req.query.ndays}`
    );
    if (response.data?.items?.length > 0) {
      res.json(response.data);
    } else {
      console.warn('Leere oder ungültige API-Daten:', response.data);
      res.status(404).json({ error: "Keine Events gefunden" });
    }
  } catch (error) {
    console.error('Fehler beim Abrufen von Events:', error.message);
    res.status(500).json({ error: 'Fehler beim Abrufen von Events', details: error.message });
  }
});

// Endpunkt: Kategorien
app.get('/categories', async (req, res) => {
  try {
    const response = await axios.get(
      'https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?type=listkat'
    );
    if (response.data && Array.isArray(response.data.items)) {
      res.json(response.data);
    } else {
      console.error("Ungültige Antwort von der API:", response.data);
      res.status(500).json({ error: "Ungültige API-Daten" });
    }
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
