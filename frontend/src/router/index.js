import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import NewRequestView from '@/views/NewRequestView.vue';
import RequestsView from '@/views/RequestsView.vue';
import RequestDetailView from '@/views/RequestDetailView.vue';
import MonitorView from '@/views/MonitorView.vue';
import AuthView from '@/views/AuthView.vue';

const routes = [
  { path: '/login', name: 'login', component: AuthView, meta: { public: true } },
  { path: '/', name: 'dashboard', component: DashboardView, meta: { auth: true } },
  { path: '/nueva', name: 'nueva-solicitud', component: NewRequestView, meta: { auth: true } },
  { path: '/solicitudes', name: 'listado', component: RequestsView, meta: { auth: true } },
  { path: '/solicitudes/:id', name: 'detalle', component: RequestDetailView, meta: { auth: true } },
  { path: '/monitor', name: 'monitor', component: MonitorView, meta: { auth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const tieneSesion = Boolean(localStorage.getItem('taskflow-token'));
  if (to.meta.auth && !tieneSesion) return { name: 'login' };
  if (to.name === 'login' && tieneSesion) return { name: 'dashboard' };
});

window.addEventListener('taskflow:unauthorized', () => router.replace({ name: 'login' }));

export default router;
