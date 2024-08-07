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

// Function to set a new school in Redis
function setNewSchool(schoolName, value) {
    client.set(schoolName, value, redis.print);
}

// Function to display the value of a school in Redis
function displaySchoolValue(schoolName) {
    client.get(schoolName, (err, reply) => {
        console.log(reply);
    });
}

// Call the functions
displaySchoolValue("Holberton");
setNewSchool("HolbertonSanFrancisco", "100");
displaySchoolValue("HolbertonSanFrancisco");
