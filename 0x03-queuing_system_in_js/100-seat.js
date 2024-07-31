import express from "express";
import redis from "redis";
import kue from "kue";
import { promisify } from "util";

const app = express();
const port = 1245;

// Initialize Redis client and Kue queue
const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const queue = kue.createQueue();

let reservationEnabled = true;

// Initialize the number of available seats
(async () => {
    await setAsync("available_seats", 50);
})();

// Reserve seats
async function reserveSeat(number) {
    await setAsync("available_seats", number);
}

// Get current available seats
async function getCurrentAvailableSeats() {
    const seats = await getAsync("available_seats");
    return seats ? parseInt(seats, 10) : 0;
}

// Route to get available seats
app.get("/available_seats", async (req, res) => {
    const availableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: availableSeats.toString() });
});

// Route to reserve a seat
app.get("/reserve_seat", async (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: "Reservation are blocked" });
    }

    const job = queue.create("reserve_seat").save((err) => {
        if (!err) {
            return res.json({ status: "Reservation in process" });
        }
        return res.json({ status: "Reservation failed" });
    });

    job.on("complete", () => {
        console.log(`Seat reservation job ${job.id} completed`);
    });

    job.on("failed", (err) => {
        console.log(`Seat reservation job ${job.id} failed: ${err}`);
    });
});

// Route to process queue
app.get("/process", async (req, res) => {
    res.json({ status: "Queue processing" });

    queue.process("reserve_seat", async (job, done) => {
        try {
            const availableSeats = await getCurrentAvailableSeats();
            if (availableSeats <= 0) {
                reservationEnabled = false;
                return done(new Error("Not enough seats available"));
            }

            await reserveSeat(availableSeats - 1);
            done();
        } catch (err) {
            done(err);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
