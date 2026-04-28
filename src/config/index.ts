export const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8000",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:8080",
  "http://localhost:8080",
  "https://wya-rho.vercel.app",
  "https://wya-admin.vercel.app"
];

export const config = {
  PORT: process.env.PORT,
  APP_EMAIL: process.env.APP_EMAIL,
  APP_EMAIL_PASSWORD: process.env.APP_EMAIL_PASSWORD,
  API_VERSION: process.env.API_VERSION,
  API_URL: process.env.API_URL,
  APP_URL: process.env.APP_URL,
  APP_NAME: process.env.APP_NAME,
  DATABASE_URL: process.env.DATABASE_URL,


  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN!,
  JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};