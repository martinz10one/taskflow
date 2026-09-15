export function rutaNoEncontrada(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

export function manejoErrores(err, req, res, next) {
  const codigo = err.status || 500;
  const mensaje = codigo === 500 ? 'Error interno del servidor' : err.message;
  if (codigo === 500) {
    console.error(err);
  }
  res.status(codigo).json({ error: mensaje });
}