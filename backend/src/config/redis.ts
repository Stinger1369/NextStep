import * as redis from "redis";

const client = redis.createClient({
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
});

client.on("error", (err: any) => console.log("Redis Client Error", err));

const connectRedis = async () => {
  await client.connect();
  console.log("Redis connected");
};

connectRedis();

export default client;
