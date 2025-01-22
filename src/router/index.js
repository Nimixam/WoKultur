import { createRouter, createWebHistory } from 'vue-router';
import FilterView from '../components/Filter.vue'; // Oder eine andere existierende Komponente

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: FilterView, // Verwenden Sie hier eine andere gültige Komponente
    },
  ],
});

export default router;