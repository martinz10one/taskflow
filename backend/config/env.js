import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};