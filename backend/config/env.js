import dotenv from 'dotenv';
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  runWorkerInApi: process.env.RUN_WORKER_IN_API === 'true',
  jwtSecret: process.env.JWT_SECRET || 'local-development-secret-change-before-deploy-0123456789',
  trustProxy: process.env.TRUST_PROXY === 'true',
};

if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) {
  throw new Error('PORT debe ser un número entero entre 1 y 65535');
}

if (env.nodeEnv === 'production' && (!process.env.JWT_SECRET || env.jwtSecret.length < 32)) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres en producción');
}