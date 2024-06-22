// src/utils/sessionUtils.ts
import redisClient from "../config/redis";

export const createSession = async (
  sessionId: string,
  sessionData: any,
  expiration: number
) => {
  console.log(`Creating session in Redis with sessionId: ${sessionId}`);
  await redisClient.set(sessionId, JSON.stringify(sessionData), {
    EX: expiration,
  });
  console.log(`Session created in Redis with sessionId: ${sessionId}`);
};

export const getSession = async (sessionId: string) => {
  console.log(`Getting session from Redis with sessionId: ${sessionId}`);
  const sessionData = await redisClient.get(sessionId);
  console.log(`Session retrieved from Redis with sessionId: ${sessionId}`);
  return sessionData ? JSON.parse(sessionData) : null;
};

export const deleteSession = async (sessionId: string) => {
  console.log(`Deleting session from Redis with sessionId: ${sessionId}`);
  await redisClient.del(sessionId);
  console.log(`Session deleted from Redis with sessionId: ${sessionId}`);
};
