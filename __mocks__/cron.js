const CronJob = jest.fn((interval, callback, inComplete, start) => {
  return {
    stop: jest.fn(),
  };
});

const CronTime = jest.fn();

module.exports = {
  CronJob,
  CronTime,
};
