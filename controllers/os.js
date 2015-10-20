var os = require('os');

exports.init = function(app) {

	app.route('/os')
        .get(function (req,res) {
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
}