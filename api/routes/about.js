const Scene = require('./../models/scene');
const Dio = require('./../models/dio');
const os = require('os');
const props = require('./../../package.json');

module.exports = app => {
  app.get('/anna', (req, res) => res.end());

  app.get('/api/about', (req, res) => {
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
    });
  });

  app.get('/api', (req, res) => {
    const getAllScene = Scene.find({});
    const getAllDio = Dio.find({});
    const getHueLights = app.service.hue.getLights();
    const getAllJobs = app.service.agenda.find({});

    Promise.all([getAllScene, getAllDio, getHueLights, getAllJobs])
      .then(values => {
        res.send({
          scenes: values[0],
          dios: values[1],
          hueLights: values[2],
          jobs: values[3],
        });
      })
      .catch(err => res.status(500).send({ err }));
  });
};
