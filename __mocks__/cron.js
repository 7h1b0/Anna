const CronJob = jest.fn(() => {
  return {
    stop: jest.fn(),
  };
});

const CronTime = jest.fn();

module.exports = {
  CronJob,
  CronTime,
};
