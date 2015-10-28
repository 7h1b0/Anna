const os = require('os');

exports.init = function (app) {

	app.route('/os')
        .get(function (req, res) {
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

    app.route('/configuration')
        .get(function (req, res) {
            const config        = app.get('config').hue;

            const Scene         = require('./../models/scene');
            const Timer         = require('./../models/timer');
            const Dio           = require('./../models/dio');
            const HueService    = require('./../services/hueService');
            hueService          = new HueService(config.hostname, config.username);

            const getAllScene   = Scene.find({}).exec();
            const getAllTimer   = Timer.find({}).exec();
            const getAllDio     = Dio.find({}).exec();
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