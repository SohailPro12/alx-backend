/* Test createPushNotificationsJobs*/
const createPushNotificationsJobs = require('./8-job');
const kue = require('kue');
import { expect } from 'chai';

describe('createPushNotificationsJobs', function () {
    let queue;
  
    before(() => {
      queue = kue.createQueue();
      kue.testMode.enter();
    });
  
    after(() => {
      kue.Job.removeAll((err) => {
        if (err) console.error(err);
      });
      kue.testMode.exit();
    });
  
    it('should display an error message if jobs is not an array', (done) => {
      try {
        createPushNotificationsJobs('not an array', queue);
      } catch (err) {
        expect(err.message).to.equal('Jobs is not an array');
        done();
      }
    });
  
    it('should create two new jobs in the queue', (done) => {
      const jobs = [{ phoneNumber: '4153518780', message: 'Hello' }, { phoneNumber: '4153518781', message: 'World' }];
      
      createPushNotificationsJobs(jobs, queue);
  
      queue.testMode.jobs((err, jobs) => {
        if (err) return done(err);
        expect(jobs).to.have.lengthOf(2);
        done();
      });
    });
  });