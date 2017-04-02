const { hue } = require('../../config.json');

const dioService = require('./dioService')();
const scheduleService = require('./scheduleService')();
const requestService = require('./requestService');
const hueService = require('./hueService')(hue.hostname, hue.token);
const execService = require('./execService');

module.exports = {
  dioService,
  requestService,
  scheduleService,
  hueService,
  execService,
};
