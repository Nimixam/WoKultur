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
      <option v-for="element in storedEventsData.value.find(obj => obj.ndays === TimeLine.sliderValue).availableCategories" :key="element.id" :value="element.id">
        {{ element.name }}
      </option>
    </select>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { loadEvents } from './EventsMap.vue';
import { TimeLine } from './TimeLine.vue';

const sliderValue = ref(TimeLine.sliderValue);

const categoryData = ref([]);

const storedEventsData = ref([]);

getCategory();


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

function fetchEvents(days) {
  for (let index = 0; index < categoryData.value.length; index++) {
    
    fetch(`http://localhost:3000/events?id=${categoryData.value[index].id}&ndays=${days}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          if (data.items.length >= 1) {
            let foundObject = undefined;
            if ((foundObject = storedEventsData.value.find(obj => obj.ndays === days)) != undefined) {
              foundObject.availableCategories.push(
                {
                  id: categoryData.value[index].id,
                  name: categoryData.value[index].kategorie,
                  events: data.items
                }
              );
            }
            else {
              storedEventsData.value.push(
                {
                  ndays: days,
                  availableCategories: [
                    {
                      id: categoryData.value[index].id,
                      name: categoryData.value[index].kategorie,
                      events: data.items
                    }
                  ]
                }
              );
            }
          }
        }
      });

  }
}

function updateMap(event) {
  const selection = event.target.value;
  console.log(selection);
  loadEvents(selection);
}
</script>
