module.exports = function (router, config) {
    
	router.get('/api/os', function (req, res) {
    const os = require('os');
      
  	res.json({
  		release: os.release(),
  		hostname: os.hostname(),
  		uptime: os.uptime(),
  		cpus: os.cpus(),
  		loadavg: os.loadavg(),
  		totalmem: os.totalmem(),
  		freemem: os.freemem(),
        nodejs: process.version    		
  	});	
	});

  router.get('/api/configuration', function (req, res) {
    const Scene         = require('./../models/scene');
    const Timer         = require('./../models/timer');
    const Dio           = require('./../models/dio');
    const HueService    = require('./../services/hueService');
    hueService          = new HueService(config.hue.hostname, config.hue.username);

    const getAllScene   = Scene.find({});
    const getAllTimer   = Timer.find({});
    const getAllDio     = Dio.find({});
    const getHueLights  = hueService.getLights();

    Promise.all([getAllScene, getAllTimer, getAllDio, getHueLights]).then(values => {
        const configuration = {
            scenes: values[0],
            timers: values[1],
            dios: values[2],
            lights: values[3]
        }
        res.send(configuration);
    }, err => {
        res.status(500).send(err);
    });
  });
}