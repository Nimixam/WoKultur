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
    // Filtern
    const filtered = props.allEvents.filter(
      e => e.kategorie_id == selectedCategory.value
    )
    emit('updateFilteredEvents', filtered)
  }
}
</script>
