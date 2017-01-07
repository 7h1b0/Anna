const exec = require('child_process').exec;

module.exports = script => new Promise((resolve, reject) => {
  exec(script, (error, stdout, stderr) => {
    if (error) {
      reject(stderr);
    } else {
      resolve(stdout);
    }
  });
});
