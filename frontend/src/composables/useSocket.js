import { ref, onMounted, onUnmounted } from 'vue';

export function useSocket() {
  const conectado = ref(false);

  let socketModule = null;

  onMounted(async () => {
    socketModule = (await import('@/plugins/socket')).default;
    conectado.value = socketModule.connected;

    socketModule.on('connect', () => { conectado.value = true; });
    socketModule.on('disconnect', () => { conectado.value = false; });
  });

  onUnmounted(() => {
    if (socketModule) {
      socketModule.off('connect');
      socketModule.off('disconnect');
    }
  });

  function on(evento, cb) {
    const load = async () => {
      const s = (await import('@/plugins/socket')).default;
      s.on(evento, cb);
    };
    load();
  }

  function off(evento, cb) {
    const load = async () => {
      const s = (await import('@/plugins/socket')).default;
      s.off(evento, cb);
    };
    load();
  }

  return { conectado, on, off };
}
