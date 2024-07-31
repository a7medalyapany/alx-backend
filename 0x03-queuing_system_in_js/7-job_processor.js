import kue from "kue";

// Create a Kue queue
const queue = kue.createQueue();

// Array of blacklisted phone numbers
const blacklistedNumbers = ["4153518780", "4153518781"];

// Function to send notification
function sendNotification(phoneNumber, message, job, done) {
    job.progress(0, 100);

    if (blacklistedNumbers.includes(phoneNumber)) {
        return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    }

    job.progress(50, 100);
    console.log(
        `Sending notification to ${phoneNumber}, with message: ${message}`
    );
    done();
}

// Process jobs from the queue with a concurrency of 2
queue.process("push_notification_code_2", 2, (job, done) => {
    sendNotification(job.data.phoneNumber, job.data.message, job, done);
});
