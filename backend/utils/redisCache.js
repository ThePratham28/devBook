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
        const data = await redis.get(key);
        if (!data) return null; // No cached data
        try {
            return JSON.parse(data); // Parse JSON
        } catch (error) {
            console.error("Invalid JSON in cache for key:", key, data);
            return null; // Return null if JSON is invalid
        }
};

export const invalidateCache = async (key) => {
    try {
        await redis.del(key);
    } catch (error) {
        console.error("Error invalidating cache:", error);
    }
};
