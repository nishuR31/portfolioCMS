import app from "./app";
import { PORT, NODE_ENV } from "./config/envConfig";
import { disconnectRedis } from "./config/redisConfig";

const startServer = async () => {
  try {
    const address = await app.listen({ port: PORT });
    console.log(`AuthService started`);
    console.log(`   Environment : ${NODE_ENV}`);
    console.log(`   Port        : ${PORT}`);
    console.log(`   Address     : ${address}`);
    console.log(`   Health      : ${address}/health`);
    console.log(`   API Base    : ${address}/api/v1`);
  } catch (err: any) {
    console.log(err?.message || err);
    process.exit(1);
  }
};

startServer();
// await redis.connect();
// console.log(`   Redis      : ${"Ram installed"}`);

async function gracefulShutdown(signal: string) {
  console.log(`\n Received ${signal}. Shutting down gracefully…`);

  app.close(async () => {
    console.log("HTTP server closed.");

    try {
      await disconnectRedis();
    } catch (err) {
      console.log("Error dismounting RAM", { error: err });
    }

    console.log("All connections closed. Goodbye!");
    process.exit(0);
  });

  setTimeout(() => {
    console.log("Shutdown timed out. Forcing exit.");
    process.exit(1);
  }, 10_000);
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("unhandledRejection", (reason: any) => {
  console.log("Unhandled Rejection", { error: reason?.message || reason });
});

process.on("uncaughtException", (error: Error) => {
  console.log("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
