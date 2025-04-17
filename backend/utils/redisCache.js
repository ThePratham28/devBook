import redis from "./redisClient.js";

const TTL = 60 * 15;

export const setCache = async (key, value, ttl = TTL) => {
    try {
        await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
        console.error("Error setting cache:", error);
    }
};

export const getCache = async (key) => {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error getting cache:", error);
        return null;
    }
};

export const invalidateCache = async (key) => {
    try {
        await redis.del(key);
    } catch (error) {
        console.error("Error invalidating cache:", error);
    }
};
