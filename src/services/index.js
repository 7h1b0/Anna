const { hue } = require('../../config.json');

const dioService = require('./dioService')();
const scheduleService = require('./scheduleService')();
const requestService = require('./requestService');
const hueService = require('./hueService');
const execService = require('./execService');

hueService.init(hue.hostname, hue.token);

module.exports = {
  dioService,
  requestService,
  scheduleService,
  hueService,
  execService,
};
