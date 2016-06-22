module.exports = app => ({
  date: '0 6 * * *',
  name: 'myExample',
  cb(job, done) {
    console.log('Something funny ...');
    done();
  },
});
