import { CATEGORIAS, PRIORIDADES } from './estados';

export function validateRequest(datos) {
  const errores = [];

  if (!datos.titulo || !datos.titulo.trim()) {
    errores.push('El título es obligatorio.');
  }
  if (!datos.descripcion || !datos.descripcion.trim()) {
    errores.push('La descripción es obligatoria.');
  }
  if (!datos.categoria || !CATEGORIAS.includes(datos.categoria)) {
    errores.push(`Categoría inválida. Permitidas: ${CATEGORIAS.join(', ')}`);
  }
  if (datos.prioridad && !PRIORIDADES.includes(datos.prioridad)) {
    errores.push(`Prioridad inválida. Permitidas: ${PRIORIDADES.join(', ')}`);
  }

  return errores;
}
