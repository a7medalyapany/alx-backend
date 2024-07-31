import redis from "redis";

// Create a Redis client
const client = redis.createClient();

// Handle successful connection
client.on("connect", () => {
    console.log("Redis client connected to the server");
});

// Handle connection error
client.on("error", (err) => {
    console.log("Redis client not connected to the server:", err.message);
});

// Function to set hash values in Redis
function createHolbertonSchools() {
    client.hset("HolbertonSchools", "Portland", 50, redis.print);
    client.hset("HolbertonSchools", "Seattle", 80, redis.print);
    client.hset("HolbertonSchools", "New York", 20, redis.print);
    client.hset("HolbertonSchools", "Bogota", 20, redis.print);
    client.hset("HolbertonSchools", "Cali", 40, redis.print);
    client.hset("HolbertonSchools", "Paris", 2, redis.print);
}

// Function to display hash values from Redis
function displayHolbertonSchools() {
    client.hgetall("HolbertonSchools", (err, reply) => {
        if (err) {
            console.error(err);
        } else {
            console.log(reply);
        }
    });
}

// Call the functions
createHolbertonSchools();
displayHolbertonSchools();
