import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  listarSolicitudes,
  obtenerEstadisticas,
  obtenerMonitor,
} from '@/services/requestService';
import socket from '@/plugins/socket';

export const useRequestStore = defineStore('requests', () => {
  const solicitudes = ref([]);
  const estadisticas = ref({ total: 0, pendientes: 0, enCola: 0, procesando: 0, respondidas: 0, errores: 0 });
  const monitor = ref({ servicios: {}, solicitudes: {} });

  async function fetchSolicitudes(filtros = {}) {
    solicitudes.value = await listarSolicitudes(filtros);
  }

  async function fetchEstadisticas() {
    estadisticas.value = await obtenerEstadisticas();
  }

  async function fetchMonitor() {
    monitor.value = await obtenerMonitor();
  }

  function initSocket() {
    socket.on('solicitud-creada', (s) => {
      solicitudes.value.unshift(s);
      estadisticas.value.total++;
      estadisticas.value.enCola++;
    });

    socket.on('solicitud-encolada', ({ id, estado }) => {
      const s = solicitudes.value.find((x) => x.id === id);
      if (s) s.estado = estado;
    });

    socket.on('solicitud-procesando', ({ id }) => {
      const s = solicitudes.value.find((x) => x.id === id);
      if (s) {
        if (s.estado === 'EN COLA') estadisticas.value.enCola--;
        s.estado = 'PROCESANDO';
        estadisticas.value.procesando++;
      }
    });

    socket.on('solicitud-respondida', ({ id, respuesta }) => {
      const s = solicitudes.value.find((x) => x.id === id);
      if (s) {
        s.estado = 'RESPONDIDA';
        s.respuesta = respuesta;
        s.fechaRespuesta = new Date().toISOString();
        estadisticas.value.procesando--;
        estadisticas.value.respondidas++;
      }
    });

    socket.on('solicitud-error', ({ id, error: err }) => {
      const s = solicitudes.value.find((x) => x.id === id);
      if (s) {
        s.estado = 'ERROR';
        s.error = err;
        if (s.estado !== 'ERROR') estadisticas.value.procesando--;
        estadisticas.value.errores++;
      }
    });
  }

  return {
    solicitudes,
    estadisticas,
    monitor,
    fetchSolicitudes,
    fetchEstadisticas,
    fetchMonitor,
    initSocket,
  };
});
