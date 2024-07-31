import kue from "kue";

// Create a Kue queue
const queue = kue.createQueue();

// Job data
const jobData = {
    phoneNumber: "4153518780",
    message: "This is the code to verify your account"
};

// Create a job in the queue
const job = queue.create("push_notification_code", jobData).save((err) => {
    if (!err) {
        console.log(`Notification job created: ${job.id}`);
    }
});

// Event listener for job completion
job.on("complete", () => {
    console.log("Notification job completed");
});

// Event listener for job failure
job.on("failed", () => {
    console.log("Notification job failed");
});
