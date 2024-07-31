import redis from "redis";
import { promisify } from "util";

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

// Promisify the get function
const getAsync = promisify(client.get).bind(client);

// Function to set a new school in Redis
function setNewSchool(schoolName, value) {
    client.set(schoolName, value, redis.print);
}

// Async function to display the value of a school in Redis
async function displaySchoolValue(schoolName) {
    try {
        const reply = await getAsync(schoolName);
        console.log(reply);
    } catch (err) {
        console.error(err);
    }
}

// Call the functions
displaySchoolValue("Holberton");
setNewSchool("HolbertonSanFrancisco", "100");
displaySchoolValue("HolbertonSanFrancisco");
