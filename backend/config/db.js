import mongoose from 'mongoose';
import { env } from './env.js';

export async function conectarDB() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}