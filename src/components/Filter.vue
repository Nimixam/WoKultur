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
      <option v-for="element in categoryData.items" :key="element.id" :value="element.id"> {{ element.kategorie }}</option>
    </select>
  </form>
</template>

  <script setup>
    import { ref } from 'vue'
    // import { id } from './EventsMap.vue'
    import { loadEvents } from './EventsMap.vue'

    const arrayLength = ref(0)
    const categoryData = ref("")
    

    getCategory()

    function getCategory() {
      fetch("https://api.allorigins.win/raw?url=https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?type=listkat")
      .then((response) => response.json())
      .then(data => {
        console.log(data)
        categoryData.value = data
        arrayLength.value = data.items.length
      
      })
    }

    function updateMap(event) {
      // id = selection.value
      const selection = event.target.value; // Zugriff auf den Wert der ausgewählten Option
      console.log(selection)
      loadEvents(selection)
    }

    

  </script>