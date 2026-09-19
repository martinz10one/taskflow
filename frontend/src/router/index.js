import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import NewRequestView from '@/views/NewRequestView.vue';
import RequestsView from '@/views/RequestsView.vue';
import RequestDetailView from '@/views/RequestDetailView.vue';
import MonitorView from '@/views/MonitorView.vue';

const routes = [
  { path: '/',           name: 'dashboard',      component: DashboardView },
  { path: '/nueva',      name: 'nueva-solicitud', component: NewRequestView },
  { path: '/solicitudes', name: 'listado',        component: RequestsView },
  { path: '/solicitudes/:id', name: 'detalle',    component: RequestDetailView },
  { path: '/monitor',    name: 'monitor',         component: MonitorView },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
