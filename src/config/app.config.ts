/**
 * @file src/config/app.config.ts
 * @description Typed application configuration factory.
 * All environment variables are read once here and exported as a typed object.
 */

export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  nodeEnv: process.env.NODE_ENV ?? 'development',
});
