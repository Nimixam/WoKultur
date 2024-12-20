import { createRouter, createWebHistory } from 'vue-router';
import MapView from '../components/MapView.vue'; // Importiere die MapView-Komponente

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // Hauptpfad
      name: 'home',
      component: MapView, // Lade MapView für den Hauptpfad
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
});

export default router;
