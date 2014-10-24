var os = require('os');

exports.init = function(app){

	app.route('/info').get(function(req,res,next){
		res.json({
			release: os.release(),
			hostname:os.hostname(),
			plateform:os.platform(),
			uptime:os.uptime(),
			totalmem:os.totalmem(),
			freemem:os.freemem(),
			cpus:os.cpus(),
			network:os.networkInterfaces()
		});
	});
}