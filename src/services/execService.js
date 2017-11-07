const exec = require('child_process').exec;
const { promisify } = require('util');

module.exports = script => promisify(exec)(script);
