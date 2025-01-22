<template>
  <section>
    <div class="w-full px-4">
      <!-- Titel oder Überschrift -->
      <h1 class="text-2xl font-bold mb-4">Meine Timeline</h1>

      <!-- Slider-Regler -->
      <input type="range" class="w-full accent-blue-500" min="1" max="14" step="1" v-model="sliderValue" />

      <!-- Ausgabe des aktuellen Werts (Debug und Datum) -->
      <p class="mt-4">Aktueller Slider-Wert: {{ sliderValue }}</p>
      <p class="mt-2">Datum: {{ currentDate }}</p>
    </div>

    <!-- Filterleiste -->
    <form class="filter-container" id="filter">
      <label for="city-filter" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Kategorie wählen:
      </label>
      <select
        id="kat-filter"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
        @change="updateMap"
        v-model="selectedCategory"
      >
        <option value="" selected>Alle Kategorien</option>
        <option
          v-for="element in availableCategories"
          :key="element.id"
          :value="element.id"
        >
          {{ element.name }}
        </option>
      </select>
    </form>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { loadEvents } from './EventsMap.vue';

// Slider-Wert und Datum
const sliderValue = ref(1); // Standardwert: Heute
const currentDate = computed(() => {
  const today = new Date();
  const offsetInDays = sliderValue.value - 1; // Slider-Wert 1 entspricht heute
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + offsetInDays);
  return targetDate.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Kategorien und Events
const categoryData = ref([]);
const storedEventsData = ref([]);
const selectedCategory = ref(""); // Standard: Alle Kategorien

// Berechnung der verfügbaren Kategorien
const availableCategories = computed(() => {
  const data = storedEventsData.value.find(obj => obj.ndays === sliderValue.value);
  return data?.availableCategories || [];
});

// Debugging-Logs
console.log("storedEventsData (initial):", storedEventsData.value);
console.log("categoryData (initial):", categoryData.value);

// Kategorien laden
getCategory();

// Änderungen am Slider beobachten
watch(sliderValue, (newSliderValue) => {
  console.log("Slider-Wert geändert:", newSliderValue);
  fetchEvents(newSliderValue);
});

// Funktionen

// Kategorien abrufen
function getCategory() {
  fetch("http://localhost:3000/categories")
    .then((response) => response.json())
    .then((data) => {
      if (data && Array.isArray(data.items)) {
        categoryData.value = data.items;
        console.log(`Kategorien erfolgreich geladen: ${data.items.length} Kategorien.`);
      } else {
        console.error("Die API-Daten für Kategorien sind nicht im erwarteten Format:", data);
        categoryData.value = [];
      }
    })
    .catch((error) => {
      console.error("Fehler beim Abrufen der Kategorien:", error);
    });
}

// Events basierend auf Tagen abrufen
function fetchEvents(days) {
  console.log(`Fetching events for ${days} days...`);

  if (categoryData.value.length === 0) {
    console.warn("Kategorien sind nicht geladen. Vorgang wird abgebrochen.");
    return;
  }

  const existingData = storedEventsData.value.find((obj) => obj.ndays === days);
  if (existingData) {
    console.log(`Daten für ndays=${days} sind bereits vorhanden.`);
    return;
  }

  const promises = categoryData.value.map((category) => {
    const url = `http://localhost:3000/events?id=${category.id}&ndays=${days}`;
    console.log("Fetching URL:", url);

    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          console.log(`Daten für Kategorie "${category.kategorie}" empfangen:`, data.items);

          let storedData = storedEventsData.value.find((obj) => obj.ndays === days);
          if (!storedData) {
            storedData = { ndays: days, availableCategories: [] };
            storedEventsData.value.push(storedData);
          }
          storedData.availableCategories.push({
            id: category.id,
            name: category.kategorie,
            events: data.items,
          });
        } else {
          console.warn(`Keine Events für Kategorie "${category.kategorie}" gefunden.`);
        }
      })
      .catch((error) => {
        console.error(`Fehler beim Abrufen von Events für Kategorie ${category.id}:`, error);
      });
  });

  Promise.all(promises)
    .then(() => {
      console.log("Alle Events erfolgreich abgerufen.");
    })
    .finally(() => {
      console.log("storedEventsData nach Abruf:", storedEventsData.value);
    });
}

// Karte aktualisieren basierend auf der Auswahl
function updateMap(event) {
  const selection = event.target.value;
  console.log("Auswahl geändert:", selection);

  if (!selection) {
    console.log("Alle Events anzeigen...");
    loadEvents(); // Alle Events laden
  } else {
    console.log(`Gefilterte Events für Kategorie ${selection} anzeigen...`);
    loadEvents(selection); // Nach Kategorie filtern
  }
}
</script>
