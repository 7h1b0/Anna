const execService = require('./execService');
const logger = require('../modules/logger');

let queue = Promise.resolve();
const run = async (script, onSuccess, onError) => {
  queue = queue.then(async () => {
    try {
      await execService(script);
      onSuccess();
    } catch (err) {
      onError();
      logger.error(err);
    }
  });
};

module.exports = {
  add(device, on = false) {
    return new Promise((resolve, reject) => {
      const status = on ? 1 : 0;
      run(`./radioEmission ${device} ${status}`, resolve, reject);
    });
  },
};
