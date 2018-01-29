export const MailJobs = JobCollection('emails');

MailJobs.processJobs('send', function (job, cb) {
  const email = job.data;
  console.log(email);
  //TODO: Implement sending
  job.done();
  cb();
});
