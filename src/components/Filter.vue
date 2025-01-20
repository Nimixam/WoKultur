<template>
  <form class="filter-container" id="filter">
    <label
      for="city-filter"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Kategorie wählen:</label
    >
    <select
      id="kat-filter"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
      @change="updateMap"
    >
      <option value="" disabled>Kategorie wählen</option>
      <option v-for="element in categoryData.items" :key="element.id" :value="element.id">
        {{ element.kategorie }}
      </option>
    </select>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { loadEvents } from './EventsMap.vue';

const categoryData = ref({ items: [] });

getCategory();

function getCategory() {
  fetch("http://localhost:3000/categories")
    .then(response => response.json())
    .then(data => {
      if (data && Array.isArray(data.items)) {
        categoryData.value = data;
        console.log(`Es gibt ${data.items.length} Kategorien.`);
      } else {
        console.error("Die API-Daten sind nicht im erwarteten Format:", data);
        categoryData.value = { items: [] };
      }
    })
    .catch(error => {
      console.error("Fehler beim Abrufen der Kategorien:", error);
    });
}

function updateMap(event) {
  const selection = event.target.value;
  console.log(selection);
  loadEvents(selection);
}
</script>
