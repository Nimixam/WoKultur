<template>
  <section>
    <div class="w-full px-4">

      <!-- Zeitraum-Slider -->
      <div class="mb-4">
        <label for="days-slider" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Zeitraum: {{ localDaysToFilter }} Tage
        </label>
        <input id="days-slider" type="range" min="1" max="90" v-model.number="localDaysToFilter"
          class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
      </div>

      <!-- Kategorie-Filter -->
      <div class="mb-4">
        <form class="filter-container" id="filter">
          <label for="kat-filter" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Kategorie wählen (nur Stadt Köln Events):
          </label>
          <select id="kat-filter"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            v-model="localSelectedCategory">
            <option value="">Alle Kategorien</option>
            <option v-for="cat in categoryData" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </form>
      </div>

      <!-- Button: Filter zurücksetzen -->
      <div class="flex justify-center mb-4">
        <button class="px-2 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none"
          @click="resetFilter">
          Filter zurücksetzen
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from 'vue'

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
  },
  selectedCategory: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['reloadEvents', 'update:daysToFilter', 'update:selectedCategory'])

const categoryData = ref([])

// lokale Kopien der Props
const localDaysToFilter = ref(props.daysToFilter)
const localSelectedCategory = ref(props.selectedCategory)

// Watcher, der beide lokalen Werte beobachtet und bei Änderungen an den Parent weitergibt
watch(
  [localDaysToFilter, localSelectedCategory],
  ([newDays, newCategory]) => {
    emit('update:daysToFilter', newDays)
    emit('update:selectedCategory', newCategory)
    emit('reloadEvents')
  }
)


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


function resetFilter() {
  localDaysToFilter.value = 14;
  localSelectedCategory.value = '';
}

</script>
