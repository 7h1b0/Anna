const user = require('./user');
const schedule = require('./schedule');
const scene = require('./scene');
const log = require('./log');
const hueGroup = require('./hueGroup');
const hueLight = require('./hueLight');
const dios = require('./dio');
const alias = require('./alias');
const about = require('./about');

module.exports = [
  about,
  user,
  schedule,
  scene,
  log,
  hueGroup,
  hueLight,
  dios,
  alias,
];
