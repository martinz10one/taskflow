import mongoose from 'mongoose';

const CATEGORIAS = ['Informacion', 'Soporte', 'Documento', 'Consulta', 'Actualizacion'];
const PRIORIDADES = ['Alta', 'Media', 'Baja'];
const ESTADOS = ['PENDIENTE', 'EN COLA', 'PROCESANDO', 'RESPONDIDA', 'ERROR'];

const solicitudSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    categoria: { type: String, required: true, enum: CATEGORIAS },
    prioridad: { type: String, required: true, enum: PRIORIDADES, default: 'Media' },
    estado: { type: String, enum: ESTADOS, default: 'PENDIENTE' },
    respuesta: { type: String, default: '' },
    error: { type: String, default: '' },
    fechaCreacion: { type: Date, default: Date.now },
    fechaProcesamiento: { type: Date, default: null },
    fechaRespuesta: { type: Date, default: null },
  },
  { versionKey: false }
);

export const CATEGORIAS_VALIDAS = CATEGORIAS;
export const PRIORIDADES_VALIDAS = PRIORIDADES;
export const ESTADOS_VALIDOS = ESTADOS;

export default mongoose.model('Solicitud', solicitudSchema);