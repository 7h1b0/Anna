const execService = require('./execService');
const logger = require('../utils/logger');

const queue = [];
const run = async () => {
  const next = () => {
    queue.shift();
    run();
  };

  if (queue.length !== 0) {
    const script = queue[0];
    try {
      await execService(script);
    } catch (err) {
      logger.error(err);
    } finally {
      next();
    }
  }
};

module.exports = {
  add(device, on = false) {
    const status = on ? 1 : 0;
    queue.push(`./radioEmission ${device} ${status}`);

    if (queue.length === 1) {
      run();
    }
  },
};
