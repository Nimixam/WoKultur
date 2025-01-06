<template>
  <form class="filter-container" id="filter">
    <label
      for="city-filter"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Stadt wählen:</label
    >
    <select
      id="city-filter"
      v-model="selectedCity"
      @change="$emit('updateCity', selectedCity)"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
    >
      <option value="14">Köln</option>
      <option value="50">Düsseldorf</option>
    </select>
  </form>

  <!-- <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">
    Andere Optionen
  </h3> -->
  <ul
    class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
  >
    <li
      class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
    >
      <div class="flex items-center ps-3">
        <input
          type="checkbox"
          id="flexzone-toggle"
          v-model="showFlexzones"
          @change="$emit('toggleFlexzones', showFlexzones)"
        />
        <label
          for="flexzone-toggle"
          class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Flex Zones</label
        >
      </div>
    </li>
    <li
      class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
    >
      <div class="flex items-center ps-3">
        <input
          id="react-checkbox-list"
          type="checkbox"
          value=""
          class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
        />
        <label
          for="react-checkbox-list"
          class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Placeholder</label
        >
      </div>
    </li>
    <li
      class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
    >
      <div class="flex items-center ps-3">
        <input
          id="angular-checkbox-list"
          type="checkbox"
          value=""
          class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
        />
        <label
          for="angular-checkbox-list"
          class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Placeholder</label
        >
      </div>
    </li>
    <li class="w-full dark:border-gray-600">
      <div class="flex items-center ps-3">
        <input
          id="laravel-checkbox-list"
          type="checkbox"
          value=""
          class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
        />
        <label
          for="laravel-checkbox-list"
          class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Placeholder</label
        >
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "FilterView",
  props: {
    currentCity: {
      type: String,
      required: true,
    },
    flexzonesVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selectedCity: this.currentCity,
      showFlexzones: this.flexzonesVisible,
    };
  },
};
</script>

<style scoped>
.filter-container {
  position: relative;
  z-index: 10;
  margin-bottom: 1rem;
}

label {
    font-size: 1rem;
}
</style>