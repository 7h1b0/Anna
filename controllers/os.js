var os = require('os');

exports.init = function(app){

	app.route('/info').get(function(req,res,next){
		res.json({
			release: os.release(),
			hostname:os.hostname(),
			type : os.type(),
			uptime:os.uptime(),
			freemem:os.freemem(),
			loadavg : os.loadavg()
		});
	});
}