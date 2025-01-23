<template>
  <section>
    <div class="w-full px-4">
      <h1 class="text-2xl font-bold mb-4">Meine Timeline</h1>

      <!-- Kategorie-Filter -->
      <form class="filter-container" id="filter">
        <label
          for="kat-filter"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Kategorie wählen:
        </label>
        <select
          id="kat-filter"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
          @change="filterEventsByCategory"
          v-model="selectedCategory"
        >
          <option value="" selected>Alle Kategorien</option>
          <option
            v-for="category in categoryData"
            :key="category.id"
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

// Definiere das Event, das an die Elternkomponente emittiert wird
const emit = defineEmits(["updateFilteredEvents"]);

// Daten für Filter
const categoryData = ref([]);
const storedEventsData = ref([]);
const filteredEvents = ref([]);
const selectedCategory = ref("");

// Kategorien laden
getCategory();
fetchEvents();

// Kategorien abrufen
function getCategory() {
  fetch("http://localhost:3000/categories")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && Array.isArray(data.items)) {
        categoryData.value = data.items;
      }
    })
    .catch((error) => console.error("Fehler beim Abrufen der Kategorien:", error));
}

// Events abrufen
function fetchEvents() {
  fetch("http://localhost:3000/events")
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data.events)) {
        storedEventsData.value = data.events;
        filteredEvents.value = data.events;
        emit("updateFilteredEvents", filteredEvents.value); // Standardmäßig alle Events
      }
    })
    .catch((error) => console.error("Fehler beim Abrufen der Veranstaltungen:", error));
}

// Veranstaltungen nach Kategorie filtern
function filterEventsByCategory() {
  if (!selectedCategory.value) {
    filteredEvents.value = storedEventsData.value;
    emit("updateFilteredEvents", filteredEvents.value); // Alle Events anzeigen
  } else {
    filteredEvents.value = storedEventsData.value.filter(
      (event) => event.category === selectedCategory.value
    );
    emit("updateFilteredEvents", filteredEvents.value); // Gefilterte Events emittieren
  }
}
</script>
