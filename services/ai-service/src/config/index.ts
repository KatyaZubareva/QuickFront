// src/config/index.ts
import dotenv from "dotenv";
dotenv.config();

interface Config {
  NODE_ENV: string;
  PORT: number;
  GIGACHAT_CLIENT_ID?: string;
  GIGACHAT_CLIENT_SECRET?: string;
  GIGACHAT_SCOPE?: string;
  REDIS_URL: string;
  REDIS_TTL: number;
  ALLOWED_ORIGINS: string[];
}

const config: Config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3001"),
  GIGACHAT_CLIENT_ID: process.env.GIGACHAT_CLIENT_ID,
  GIGACHAT_CLIENT_SECRET: process.env.GIGACHAT_CLIENT_SECRET,
  GIGACHAT_SCOPE: process.env.GIGACHAT_SCOPE || "GIGACHAT_API_PERS",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  REDIS_TTL: parseInt(process.env.REDIS_TTL || "3600"),
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"]
};

// Validate required environment variables
if (!config.GIGACHAT_CLIENT_ID || !config.GIGACHAT_CLIENT_SECRET) {
  console.error("❌ Missing GigaChat credentials. Please check your .env file.");
  process.exit(1);
}

export type { Config };
export default config;