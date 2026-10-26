export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  jwtSecret: process.env.JWT_SECRET || 'edugov-dev-secret-key-2026',
  corsOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000'],
  nodeEnv: process.env.NODE_ENV || 'development'
};
