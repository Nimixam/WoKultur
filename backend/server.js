const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Importiere das CORS-Paket

const app = express();
const port = 3000;

// Erlaube CORS für alle Ursprünge (optional kannst du es auf eine bestimmte Domain einschränken)
app.use(cors());  // Middleware aktivieren

// API-Endpoint, der die Daten der Stadt Köln abruft
app.get('/events', async (req, res) => {
  const { id } = req.query;  // ID wird aus der URL-Abfrage (query) entnommen
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    // Hier wird die API von Stadt Köln aufgerufen
    const response = await axios.get(`https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?kat=${id}&ndays=7`);
    
    // Erfolgreiche Antwort an den Client zurückgeben
    res.json(response.data);
  } catch (error) {
    // Falls ein Fehler auftritt, gib eine Fehlernachricht zurück
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Server starten
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});