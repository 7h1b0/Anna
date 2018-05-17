const execService = require('./execService');
const logger = require('../modules/logger');

const queue = [];
const run = async () => {
  if (queue.length !== 0) {
    const { script, onSuccess, onError } = queue[0];
    try {
      await execService(script);
      onSuccess();
    } catch (err) {
      onError();
      logger.error(err);
    } finally {
      queue.shift();
      return run();
    }
  }
};

module.exports = {
  add(device, on = false) {
    return new Promise((resolve, reject) => {
      const status = on ? 1 : 0;
      queue.push({
        script: `./radioEmission ${device} ${status}`,
        onSuccess: resolve,
        onError: reject,
      });

      if (queue.length === 1) {
        run();
      }
    });
  },
};
