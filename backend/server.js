const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // v2 (CommonJS-kompatibel)

const app = express();
app.use(cors());

// Hilfsfunktion: Konvertiere ArcGIS JSON in GeoJSON
function convertArcgisToGeojson(arcgisJson) {
  if (!arcgisJson.features) {
    return { type: "FeatureCollection", features: [] };
  }
  const features = arcgisJson.features.map(feature => {
    let geometry = feature.geometry;
    // Falls es sich um ein Polygon handelt (Rings vorhanden)
    if (geometry && geometry.rings) {
      geometry = {
        type: "Polygon",
        coordinates: geometry.rings
      };
    }
    // Falls es sich um einen Punkt handelt
    else if (geometry && geometry.x !== undefined && geometry.y !== undefined) {
      geometry = {
        type: "Point",
        coordinates: [geometry.x, geometry.y]
      };
    }
    // Falls es sich um eine Linie handelt
    else if (geometry && geometry.paths) {
      geometry = {
        type: "LineString",
        coordinates: geometry.paths[0]
      };
    }
    return {
      type: "Feature",
      properties: feature.attributes,
      geometry: geometry
    };
  });
  return { type: "FeatureCollection", features: features };
}

// Proxy-Endpoint für Events
app.get('/api/events', async (req, res) => {
  try {
    const { ndays = 14 } = req.query;
    const response = await fetch(`https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?ndays=${ndays}`);
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
    const response = await fetch('https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?type=listkat');
    const rawText = await response.text();
    const jsonData = JSON.parse(rawText);
    res.json(jsonData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proxy-Endpoint für Events nach Kategorie
app.get('/api/eventsByCategory', async (req, res) => {
  try {
    const { kat, ndays = 14 } = req.query;
    if (!kat) {
      return res.status(400).json({ success: false, error: 'Missing "kat" parameter' });
    }
    const url = `https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?kat=${kat}&ndays=${ndays}`;
    const response = await fetch(url);
    const rawText = await response.text();
    const jsonData = JSON.parse(rawText);
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Proxy-Endpoint für Sehenswürdigkeiten
app.get('/api/sehenswuerdigkeiten', async (req, res) => {
  try {
    const url = 'https://geoportal.stadt-koeln.de/arcgis/rest/services/basiskarten/stadtplanthemen/MapServer/7/query?where=objectid%20is%20not%20null&outFields=*&returnGeometry=true&outSR=4326&f=json';
    const response = await fetch(url);
    const rawText = await response.text();
    const jsonData = JSON.parse(rawText);
    res.json(jsonData);
  } catch (error) {
    console.error('Fehler beim Abruf der Sehenswürdigkeiten:', error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy-Endpoint für Ticketmaster-Events
app.get('/ticketmaster', async (req, res) => {
  try {
    const API_KEY = "GGRZCMjg9FnByATAKtPrAdc2RmYYu8ae";
    const pageSize = "199";
    const url = `https://app.ticketmaster.com/discovery/v2/events?city=cologne&size=${pageSize}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const rawText = await response.text();
    const jsonData = JSON.parse(rawText);
    res.json(jsonData);
  } catch (error) {
    console.log("Fehler beim Abrufen von Ticketmaster", error);
    res.status(500).json({ error: error.message });
  }
});

// Neuer Proxy-Endpoint für Veedel-Daten mit Konvertierung in GeoJSON
app.get('/api/veedel', async (req, res) => {
  try {
    const url =
      "https://geoportal.stadt-koeln.de/arcgis/rest/services/Basiskarten/kgg/MapServer/1/query?where=objectid+is+not+null&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson";
    const response = await fetch(url);
    const rawText = await response.text();
    const arcgisJson = JSON.parse(rawText);
    const geojson = convertArcgisToGeojson(arcgisJson);
    res.json(geojson);
  } catch (error) {
    console.error("Fehler beim Abrufen der Veedel-Daten:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Proxy-Server läuft auf Port 3000');
});
