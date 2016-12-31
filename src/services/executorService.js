const exec = require('child_process').exec;

module.exports = {
  init() {
    this.queue = [];
  },

  add(command) {
    this.queue.push(command);

    if (this.queue.length === 1) {
      this.run();
    }
  },

  next() {
    this.queue.shift();
    this.run();
  },

  run() {
    if (this.queue.length !== 0) {
      const script = this.queue[0];
      this.execute(script)
        .then(() => this.next())
        .catch(err => {
          console.log(err);
          this.next();
        });
    }
  },

  execute(script) {
    return new Promise((resolve, reject) => {
      exec(script, (error, stdout, stderr) => {
        if (error) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  },
};
