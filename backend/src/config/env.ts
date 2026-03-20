import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? "super-secret-jwt-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "24h",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:4200",
  databaseUrl: process.env.DATABASE_URL ?? "",
  db: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    name: process.env.DB_NAME ?? "blogdb",
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "1234"
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? ""
  }
};
