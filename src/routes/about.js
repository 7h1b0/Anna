const os = require('os');
const Scene = require('./../models/scene');
const Dio = require('./../models/dio');
const props = require('./../../package.json');

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
    const getHueLights = app.service.hue.getLights();
    const getHueGroups = app.service.hue.getGroups();
    const getSchedules = app.service.agenda.find({});

    Promise.all([getScenes, getDios, getHueLights, getHueGroups, getSchedules])
      .then(values => res.send({
        scenes: values[0],
        dios: values[1],
        hueLights: values[2],
        hueGroups: values[3],
        schedules: values[4],
      }))
      .catch(err => res.status(500).send({ err }));
  });
};
