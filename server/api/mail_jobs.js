export const MailJobs = JobCollection('emails');
import sendMail from '../../imports/modules/server/emails/send.js';

MailJobs.processJobs('send', function (job, cb) {
  try {
    const email = job.data;
    sendMail(email);
    job.done();
  } catch(exception) {
    job.fail();
    throw new Meteor.Error('jobs.mail.send.exception', exception);
  }
  cb();
});
