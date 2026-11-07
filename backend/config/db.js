import mongoose from 'mongoose';
import { env } from './env.js';

export async function conectarDB() {
  // Evita abrir una segunda conexión cuando el worker se ejecuta
  // dentro del mismo proceso que la API (despliegue gratuito en Render).
  if (mongoose.connection.readyState !== 0) {
    return;
  }

  try {
    await mongoose.connect(env.mongoUri);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}