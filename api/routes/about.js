const Scene = require('./../models/scene');
const Timer = require('./../models/timer');
const Dio = require('./../models/dio');
const HueService = require('./../services/hueService');
const os = require('os');

module.exports = (router, config) => {
  router.get('/anna', (req, res) => res.end());

  router.get('/api/os', (req, res) => {
    res.json({
      release: os.release(),
      hostname: os.hostname(),
      uptime: os.uptime(),
      cpus: os.cpus(),
      loadavg: os.loadavg(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
      nodejs: process.version,
    });
  });

  router.get('/api/configuration', (req, res) => {
    const hueService = new HueService(config.hue.hostname, config.hue.username, config.hue.port);

    const getAllScene = Scene.find({});
    const getAllHueScene = hueService.getScenes();
    const getAllTimer = Timer.find({});
    const getAllDio = Dio.find({});
    const getHueLights = hueService.getLights();

    Promise.all([getAllScene, getAllHueScene, getAllTimer, getAllDio, getHueLights])
      .then(values => {
        res.send({
          scenes: [...values[0], ...values[1]],
          timers: values[2],
          dios: values[3],
          hueLights: values[4],
        });
      })
      .catch(err => res.status(500).send(err));
  });
};
