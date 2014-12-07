var os = require('os')
	,exec = require('child_process').exec;

exports.init = function(app){

	app.route('/info').get(function(req,res,next){
    	res.json({
    		release: os.release(),
    		hostname:os.hostname(),
    		uptime:os.uptime(),
    		cpus:os.cpus(),
    		loadavg : os.loadavg(),
    		totalmem:os.totalmem(),
    		freemem:os.freemem()			    		
    	});	
	});
}