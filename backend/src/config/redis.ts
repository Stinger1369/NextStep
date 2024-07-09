// redis.ts
import * as redis from "redis";
import { config } from "./config";

const client = redis.createClient({
  url: config.redisURL,
});

client.on("error", (err: any) => console.log("Redis Client Error", err));

const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Redis connected");
  } catch (error) {
    console.error("Could not connect to Redis", error);
  }
};

connectRedis();

export default client;

