const exec = require('child_process').exec;

module.exports = () => {
  const queue = [];

  function add(command) {
    queue.push(command);

    if (queue.length === 1) {
      run();
    }
  }

  function run() {
    const next = () => {
      queue.shift();
      run();
    }

    if (queue.length !== 0) {
      const script = queue[0];
      execute(script)
        .then(() => next())
        .catch(err => {
          console.log(err);
          next();
        });
    }
  }

  function execute(script) {
    return new Promise((resolve, reject) => {
      exec(script, (error, stdout, stderr) => {
        if (error) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  return {
    add,
    execute,
  };
};
