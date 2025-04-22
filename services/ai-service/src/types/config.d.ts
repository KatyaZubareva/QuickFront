// src/types/config.d.ts
declare module '../config' {
  const config: {
    NODE_ENV: string;
    PORT: number;
    GIGACHAT_CLIENT_ID?: string;
    GIGACHAT_CLIENT_SECRET?: string;
    GIGACHAT_SCOPE?: string;
    REDIS_URL: string;
    REDIS_TTL: number;
    ALLOWED_ORIGINS: string[];
  };
  export default config;
}