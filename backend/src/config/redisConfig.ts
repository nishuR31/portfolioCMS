import { Redis } from "ioredis";
import { REDIS_URL } from "./envConfig.js";

const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 200, 5000);
    console.warn(`Redis reconnecting... attempt ${times}, delay ${delay}ms`);
    return delay;
  },
  enableReadyCheck: true,
  lazyConnect: true,
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error", { error: err.message }));
redis.on("close", () => console.warn("Redis connection closed"));

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
  console.log("Redis disconnected gracefully.");
}

export default redis;
