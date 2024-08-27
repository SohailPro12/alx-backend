import { createQueue } from 'kue';

const queue = createQueue();

const blacklist = ['4153518780', '4153518781'];

function sendNotification(phoneNumber, message, job, done) {

    if (blacklist.includes(phoneNumber)) {
        return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
      }

    job.progress(0, 100);

    setTimeout(() => {
        job.progress(50, 100);
        job.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
        done();
    }, 1000);
}
queue.process('push_notification_code', 2, (job, done) => {
    const { phoneNumber, message } = job.data;

    sendNotification(phoneNumber, message, job, done);
});