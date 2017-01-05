const executorService = require('./executorService')();
const scheduleService = require('./scheduleService')();
const requestService = require('./requestService');
const hueService = require('./hueService');

module.exports = {
  executorService,
  requestService,
  scheduleService,
  hueService,
};