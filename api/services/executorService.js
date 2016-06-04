const exec = require('child_process').exec;

class ExecutorService {
  constructor() {
    this.instance = this;
    this.queue = [];
  }

  static getInstance() {
    if (this.instance === undefined) {
      this.instance = new ExecutorService();
    }
    return this.instance;
  }

  add(command) {
    this.queue.push(command);

    if (this.queue.length === 1) {
      this.run();
    }
  }

  run() {
    if (this.queue.length !== 0) {
      const script = this.queue[0];
      this.execute(script).then(() => {
        this.queue.shift();
        this.run();
      });
    }
  }

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
  }
}

module.exports = ExecutorService;
