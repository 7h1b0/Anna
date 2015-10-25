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
            const config = app.get('config').hue;


            const Scene         = require('./../models/scene');
            const Group         = require('./../models/group');
            const Timer         = require('./../models/timer');
            const Dio           = require('./../models/dio');
            const HueService    = require('./../services/hueService');
            hueService = new HueService(config.hostname, config.username);

            const getAllScene   = Scene.find({}).exec();
            const getAllGroup   = Group.find({}).exec();
            const getAllTimer   = Timer.find({}).exec();
            const getAllDio     = Dio.find({}).exec();
            const getHueLights  = hueService.getLights();

            Promise.all([getAllScene, getAllGroup, getAllTimer, getAllDio, getHueLights]).then(function (values) {
                const configuration = {
                    scenes: values[0],
                    groups: values[1],
                    timers: values[2],
                    dios: values[3],
                    lights: values[4]
                }
                res.send(configuration);
            }, function (err) {
                res.status(500).send(err);
            });

        });
}