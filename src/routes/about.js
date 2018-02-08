const os = require('os');
const props = require('./../../package.json');
const Scene = require('../modules/models/scene');
const Dio = require('../modules/models/dio');
const Alias = require('../modules/models/alias');
const scheduleService = require('../services/scheduleService');
const hueService = require('../services/hueService');

module.exports = app => {
  app.get('/anna', (req, res) => res.end());

  app.get('/api/about', (req, res) =>
    res.json({
      release: os.release(),
      hostname: os.hostname(),
      uptime: os.uptime(),
      cpus: os.cpus(),
      loadavg: os.loadavg(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
      nodejs: process.version,
      version: props.version,
    }),
  );

  app.get('/api', (req, res) => {
    const getScenes = Scene.find({});
    const getDios = Dio.find({});
    const getAlias = Alias.find({});
    const getHueLights = hueService.getLights();
    const getHueGroups = hueService.getGroups();
    const schedules = scheduleService.getAll();

    Promise.all([getScenes, getDios, getHueLights, getHueGroups, getAlias])
      .then(([scenes, dios, hueLights, hueGroups, alias]) =>
        res.send({
          scenes,
          dios,
          hueLights,
          hueGroups,
          alias,
          schedules,
        }),
      )
      .catch(err => res.status(500).send({ err }));
  });
};
