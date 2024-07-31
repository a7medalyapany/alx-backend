import redis from "redis";

// Create a Redis client
const subscriber = redis.createClient();

// Handle successful connection
subscriber.on("connect", () => {
    console.log("Redis client connected to the server");
});

// Handle connection error
subscriber.on("error", (err) => {
    console.log("Redis client not connected to the server:", err.message);
});

// Subscribe to the channel
subscriber.subscribe("holberton school channel");

// Handle messages received on the subscribed channel
subscriber.on("message", (channel, message) => {
    console.log(message);
    if (message === "KILL_SERVER") {
        subscriber.unsubscribe();
        subscriber.quit();
    }
});
