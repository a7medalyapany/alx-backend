import kue from "kue";
import { expect } from "chai";
import createPushNotificationsJobs from "./8-job.js";

// Create a Kue queue
const queue = kue.createQueue();

describe("createPushNotificationsJobs", () => {
    before(() => {
        // Set the queue to test mode
        kue.testMode.enter();
    });

    after(() => {
        // Clear the queue and exit test mode
        kue.testMode.exit();
    });

    it("should throw an error if jobs is not an array", () => {
        expect(() => createPushNotificationsJobs({}, queue)).to.throw(
            "Jobs is not an array"
        );
    });

    it("should create jobs in the queue", () => {
        const list = [
            {
                phoneNumber: "4153518780",
                message: "This is the code 1234 to verify your account"
            },
            {
                phoneNumber: "4153518781",
                message: "This is the code 4562 to verify your account"
            }
        ];

        createPushNotificationsJobs(list, queue);

        const jobs = kue.testMode.jobs["push_notification_code_3"];

        expect(jobs).to.have.lengthOf(2);
        expect(jobs[0].data).to.deep.equal(list[0]);
        expect(jobs[1].data).to.deep.equal(list[1]);
    });
});
