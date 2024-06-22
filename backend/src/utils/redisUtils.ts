// redisUtils.ts
import redisClient from "../config/redis";

export const setToken = async (
  key: string,
  value: string,
  expiration: number
) => {
  console.log(`Setting token in Redis with key: ${key}`);
  await redisClient.set(key, value, { EX: expiration });
  console.log(`Token set in Redis with key: ${key}`);
};

export const getToken = async (key: string) => {
  console.log(`Getting token from Redis with key: ${key}`);
  const value = await redisClient.get(key);
  console.log(`Token retrieved from Redis with key: ${key}`);
  return value;
};

export const deleteToken = async (key: string) => {
  console.log(`Deleting token from Redis with key: ${key}`);
  await redisClient.del(key);
  console.log(`Token deleted from Redis with key: ${key}`);
};
