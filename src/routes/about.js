const os = require('os');
const Scene = require('./../models/scene');
const Dio = require('./../models/dio');
const props = require('./../../package.json');
const hueService = require('../services/hueService');
const scheduleService = require('../services/scheduleService');

module.exports = (app) => {
  app.get('/anna', (req, res) => res.end());

  app.get('/api/about', (req, res) => res.json({
    release: os.release(),
    hostname: os.hostname(),
    uptime: os.uptime(),
    cpus: os.cpus(),
    loadavg: os.loadavg(),
    totalmem: os.totalmem(),
    freemem: os.freemem(),
    nodejs: process.version,
    version: props.version,
  }));

  app.get('/api', (req, res) => {
    const getScenes = Scene.find({});
    const getDios = Dio.find({});
    const getHueLights = hueService.getLights();
    const getHueGroups = hueService.getGroups();
    const schedules = scheduleService.getAll().map(job => job.attrs);

    Promise.all([getScenes, getDios, getHueLights, getHueGroups])
      .then(values => res.send({
        scenes: values[0],
        dios: values[1],
        hueLights: values[2],
        hueGroups: values[3],
        schedules,
      }))
      .catch(err => res.status(500).send({ err }));
  });
};
