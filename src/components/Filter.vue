<template>
  <section>
    <div class="w-full px-4">
      <h1 class="text-2xl font-bold mb-4">Zeitraum</h1>

      <!-- Zeitraum-Slider -->
      <div class="mb-4">
        <label
          for="days-slider"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Zeitraum: {{ localDaysToFilter }} Tage
        </label>
        <input
          id="days-slider"
          type="range"
          min="1"
          max="30"
          v-model="localDaysToFilter"
          class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          @change="onSliderChange"
        />
      </div>

      <!-- Button: Kategorien-Filter ein-/ausklappen -->
      <button
        class="px-4 py-2 mb-4 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
        @click="toggleCategoryFilter"
      >
        {{ isCategoryFilterOpen ? 'Kategorien ausblenden' : 'Kategorien anzeigen' }}
      </button>

      <!-- Kategorie-Filter -->
      <form
        v-if="isCategoryFilterOpen"
        class="filter-container"
        id="filter"
      >
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
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'

const props = defineProps({
  allEvents: {
    type: Array,
    default: () => []
  },
  filterCatMessage: {
    type: String,
    default: ''
  },
  daysToFilter: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['updateFilteredEvents', 'reloadEvents'])

const categoryData = ref([])
const selectedCategory = ref('')

const isCategoryFilterOpen = ref(false) // Status für das Anzeigen des Kategorie-Filters
const localDaysToFilter = ref(props.daysToFilter) // Lokale Kopie der Prop

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

function onSliderChange() {
  if (isCategoryFilterOpen.value) {
    applyFilter() // Wenn der Kategorie-Filter geöffnet ist
  } else {
    emit('reloadEvents', localDaysToFilter.value) // Ansonsten lade Events mit dem Slider-Wert
  }
}

function toggleCategoryFilter() {
  isCategoryFilterOpen.value = !isCategoryFilterOpen.value
}

// Filter anwenden
function applyFilter() {
  if (!selectedCategory.value) {
    // Keine Kategorie = alle Events
    filterCatMessage.value = '';
    emit('updateFilteredEvents', props.allEvents)
  } else {
    // Neue Kategorie-Route
    fetch(`http://localhost:3000/api/eventsByCategory?kat=${selectedCategory.value}&ndays=${props.daysToFilter.value}`)
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
            lng: parseFloat(item.longitude),
            location: `${item.strasse} ${item.hausnummer}`
          }))

          // Optional: Filtern nach validen Koordinaten
          const valid = mapped.filter(ev => !isNaN(ev.lat) && !isNaN(ev.lng))

          // Jetzt emitten wir das gefilterte Array
          emit('updateFilteredEvents', valid)
        } else {
          // Keine Events oder Fehler
          emit('updateFilteredEvents', [])
        }
      })
      .catch(err => {
        console.error('Fehler beim Laden der Kategoriendaten:', err)
        // Ggf. leeres Array weitergeben
        emit('updateFilteredEvents', [])
      });
  }
}
</script>
