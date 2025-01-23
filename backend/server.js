const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

// Middleware für Fehlerprotokollierung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Endpunkt: Veranstaltungen aus lokaler JSON-Datei
app.get('/events', (req, res) => {
  const jsonPath = path.join(__dirname, 'testData.json');
  try {
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    res.json(jsonData);
  } catch (error) {
    console.error('Fehler beim Lesen der JSON-Datei:', error.message);
    res.status(500).json({ error: 'Fehler beim Abrufen der Veranstaltungen' });
  }
});

app.get('/categories', (req, res) => {
  const jsonPath = path.join(__dirname, 'testData.json');
  try {
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Kategorien dynamisch aus den Events ableiten
    const categories = jsonData.events.reduce((acc, event) => {
      if (event.category && !acc.some((cat) => cat.name === event.category)) {
        acc.push({ id: acc.length + 1, name: event.category }); // ID basierend auf Index
      }
      return acc;
    }, []);

    res.json({ items: categories });
  } catch (error) {
    console.error('Fehler beim Lesen der JSON-Datei für Kategorien:', error.message);
    res.status(500).json({ error: 'Fehler beim Abrufen der Kategorien' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
