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
          v-model="selectedCategory"
          @change="applyFilter"
        >
          <option value="">Alle Kategorien</option>
          <option
            v-for="cat in categoryData"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
      </form>
      <!-- Meldung bei fehlenden Events -->
      <p
        v-if="filterCatMessage"
        class="mt-2 text-red-600 dark:text-red-400"
      >
        {{ filterCatMessage }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'

const props = defineProps({
  allEvents: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['updateFilteredEvents'])

const categoryData = ref([])
const selectedCategory = ref('')

const filterCatMessage = ref('')

// Beim Start Kategorien laden
onMounted(() => {
  loadCategories()
})

// API-Aufruf für Kategorien
function loadCategories() {
  fetch('http://localhost:3000/api/categories')
    .then(res => res.json())
    .then(data => {
      console.log('Kategorien-Daten:', data)
      // { success: true, items: [...], count: NN }
      if (data.success && Array.isArray(data.items)) {
        categoryData.value = data.items.map(item => ({
          id: item.id,
          name: item.kategorie
        }))
      } else {
        console.error('Categories result is not an array or no success:', data)
      }
    })
    .catch(err => console.error('Fehler beim Laden der Kategorien:', err))
}

// Filter anwenden
function applyFilter() {
  if (!selectedCategory.value) {
    // Keine Kategorie = alle Events
    emit('updateFilteredEvents', props.allEvents)
  } else {
    // Neue Kategorie-Route
    fetch(`http://localhost:3000/api/eventsByCategory?kat=${selectedCategory.value}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.items)) {
          // Mappen wie in App.vue
          const mapped = data.items.map((item, index) => ({
            id: index,
            title: item.title,
            description: item.description,
            begin: item.beginndatum,
            end: item.endedatum,
            lat: parseFloat(item.latitude),
            lng: parseFloat(item.longitude)
          }))

          // Optional: Filtern nach validen Koordinaten
          const valid = mapped.filter(ev => !isNaN(ev.lat) && !isNaN(ev.lng))

          // Jetzt emitten wir das gefilterte Array
          emit('updateFilteredEvents', valid)
        } else {
          // Keine Events oder Fehler
          filterCatMessage.value = 'Keine Events im angegebenen Zeitraum'
          emit('updateFilteredEvents', [])
        }
      })
      .catch(err => {
        console.error('Fehler beim Laden der Kategoriendaten:', err)
        filterCatMessage.value = 'Keine Events im angegebenen Zeitraum (Fehler)'
        // Ggf. leeres Array weitergeben
        emit('updateFilteredEvents', [])
      });
  }
}
</script>
