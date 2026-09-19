const ESTADO_COLORES = {
  PENDIENTE:  { bg: '#f1f5f9', color: '#64748b', label: 'Pendiente' },
  'EN COLA':  { bg: '#eff6ff', color: '#2563eb', label: 'En cola' },
  PROCESANDO: { bg: '#fffbeb', color: '#d97706', label: 'Procesando' },
  RESPONDIDA: { bg: '#f0fdf4', color: '#16a34a', label: 'Respondida' },
  ERROR:      { bg: '#fef2f2', color: '#dc2626', label: 'Error' },
};

export function getEstadoStyle(estado) {
  return ESTADO_COLORES[estado] || ESTADO_COLORES.PENDIENTE;
}

export const CATEGORIAS = ['Informacion', 'Soporte', 'Documento', 'Consulta', 'Actualizacion'];
export const PRIORIDADES = ['Alta', 'Media', 'Baja'];
