module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  maxFileSize: process.env.MAX_FILE_SIZE || 5242880, // 5MB
  uploadPath: process.env.UPLOAD_PATH || './uploads'
};