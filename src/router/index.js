// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import RekeningenView from '../views/RekeningenView.vue'
import FacturenView from '../views/FacturenView.vue'
import PartiesView from '../views/PartiesView.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/rekeningen/:id?', // id is optional
    name: 'Rekeningen',
    component: RekeningenView,
    props: true
  },
  {
    path: '/facturen',
    name: 'Facturen',
    component: FacturenView,
  },
  {
    path: '/parties',
    name: 'Parties',
    component: PartiesView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;