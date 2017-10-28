const execService = require('./execService');

const queue = [];
const run = () => {
  const next = () => {
    queue.shift();
    run();
  };

  if (queue.length !== 0) {
    const script = queue[0];
    execService(script)
      .then(next)
      .catch(err => {
        console.warn(err);
        next();
      });
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
