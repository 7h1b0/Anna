const execService = require('./execService');

module.exports = () => {
  const queue = [];

  function run() {
    const next = () => {
      queue.shift();
      run();
    };

    if (queue.length !== 0) {
      const script = queue[0];
      execService(script)
        .then(() => next())
        .catch((err) => {
          console.log(err);
          next();
        });
    }
  }

  function add(device, on = false) {
    const status = on ? 1 : 0;
    queue.push(`./radioEmission ${device} ${status}`);

    if (queue.length === 1) {
      run();
    }
  }

  return { add };
};
