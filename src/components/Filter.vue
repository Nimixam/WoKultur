<template id="time">
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
  </section>


  <form class="filter-container" id="filter">
    <label for="city-filter" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kategorie
      wählen:</label>
    <select v-if="!isDataLoading" id="kat-filter"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
      @change="updateMap">
      <option v-if="storedEventsData.value.length === 0" disabled>Keine Kategorien verfügbar</option>
      <option
        v-for="element in storedEventsData.value.find(obj => obj.ndays === sliderValue.value)?.availableCategories || []"
        :key="element.id" :value="element.id">
        {{ element.name }}
      </option>
    </select>
    <p v-else>Loading...</p>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { loadEvents } from './EventsMap.vue';

// Reactive Variablen
const sliderValue = ref(1); // Standardwert: Heute
const categoryData = ref([]);

const storedEventsData = ref([]);

console.log('Initial storedEventsData:', storedEventsData.value);

// Berechnung des Datums
const currentDate = computed(() => {
  const today = new Date();
  const offsetInDays = sliderValue.value - 1; // Wert 1 = heute
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + offsetInDays);
  return targetDate.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Initialer Abruf von Kategorien
getCategory();

// Initialisierung der Events basierend auf dem Sliderwert
fetchEvents(sliderValue.value);

console.log(`Data after fetchEvents for days=${sliderValue.value}:`, storedEventsData.value);

// Beobachten von Änderungen an sliderValue
watch(sliderValue, (newSliderValue) => {
  fetchEvents(newSliderValue);
});

// Funktion zum Abrufen von Kategorien
function getCategory() {
  fetch("http://localhost:3000/categories")
    .then(response => response.json())
    .then(data => {
      if (data && Array.isArray(data.items)) {
        categoryData.value = data.items;
        console.log(`Es gibt ${data.items.length} Kategorien.`);
      } else {
        console.error("Die API-Daten sind nicht im erwarteten Format:", data);
        categoryData.value = [];
      }
    })
    .catch(error => {
      console.error("Fehler beim Abrufen der Kategorien:", error);
    });
}

const isDataLoading = ref(true); // Datenlade-Status

// Funktion zum Abrufen von Events
function fetchEvents(days) {
  if (categoryData.value.length === 0) {
    console.warn("Kategorien sind noch nicht geladen.");
    return;
  }

  if (getStoredEventsData() == undefined) {

    isDataLoading.value = true;

    fetchData(days);
  }
  else {

  }
}

function getStoredEventsData(days) {
  return storedEventsData.value.find(obj => obj.ndays === days);
}

function fetchData(days) {
  categoryData.value.forEach((category) => {
      fetch(`http://localhost:3000/events?id=${category.id}&ndays=${days}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            let foundObject = storedEventsData.value.find(obj => obj.ndays === days);

            if (!foundObject) {
              foundObject = {
                ndays: days,
                availableCategories: [],
              };
              storedEventsData.value.push(foundObject);
            }

            foundObject.availableCategories.push({
              id: category.id,
              name: category.kategorie,
              events: data.items,
            });
          }
        })
        .catch((error) => {
          console.error(`Fehler beim Abrufen von Events für Kategorie ${category.id}:`, error);
        })
        .finally(() => {
          isDataLoading.value = false;
        });
    });
}

// Funktion zur Aktualisierung der Karte
function updateMap(event) {
  const selection = event.target.value;
  console.log(selection);
  loadEvents(selection);
}
</script>
