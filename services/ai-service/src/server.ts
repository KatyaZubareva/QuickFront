// src/server.ts
import app from "./app";
import config from "./config";
import { debugRoutes } from "./utils/debugRoutes";
import { redis } from "./services/redis.service";

const server = app.listen(config.PORT, () => {
  console.log(`✅ AI Service running on port ${config.PORT}`);
  console.log(`🌐 Allowed origins: ${config.ALLOWED_ORIGINS.join(", ")}`);
  debugRoutes(app);
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`🛑 Received ${signal}, shutting down...`);

  try {
    await redis.disconnect();
  } catch (err) {
    console.error("❌ Error disconnecting Redis:", err);
  }

  server.close(() => {
    console.log("🚪 Server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("🕛 Force shutdown after timeout");
    process.exit(1);
  }, 5000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));