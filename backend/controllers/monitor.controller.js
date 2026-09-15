export async function obtenerMonitor(req, res) {
  res.json({
    servicios: {
      express: 'disponible',
      mongo: 'pendiente-verificacion',
      redis: 'sin-configurar',
      worker: 'sin-configurar',
    },
    mensaje: 'Monitor basico. Se completara al integrar Redis y el Worker.',
  });
}