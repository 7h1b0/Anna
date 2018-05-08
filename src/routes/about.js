const os = require('os');
const { version } = require('./../../package.json');
const Scene = require('../modules/models/scene');
const Dio = require('../modules/models/dio');
const Room = require('../modules/models/room');
const Alias = require('../modules/models/alias');
const scheduleService = require('../services/scheduleService');

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
      version,
    }),
  );

  app.get('/api', (req, res) => {
    const getScenes = Scene.findAll();
    const getDios = Dio.findAll();
    const getAlias = Alias.findAll();
    const getRooms = Room.findAll();
    const schedules = scheduleService.getAll();

    Promise.all([getScenes, getDios, getAlias, getRooms])
      .then(([scenes, dios, alias, rooms]) =>
        res.send({
          scenes,
          dios,
          alias,
          schedules,
          rooms,
        }),
      )
      .catch(err => res.status(500).send({ err }));
  });
};
