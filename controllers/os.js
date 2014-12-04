var os = require('os')
	,exec = require('child_process');

exports.init = function(app){

	app.route('/info').get(function(req,res,next){

		exec('cat /sys/class/thermal/thermal_zone0/temp',function(error, stdout, stderr){
			    if (error !== null) {
			    	res.json({
			    		release: os.release(),
			    		hostname:os.hostname(),
			    		plateform:os.platform(),
			    		uptime:os.uptime(),
			    		totalmem:os.totalmem(),
			    		freemem:os.freemem(),
			    		cpus:os.cpus(),
			    		tmp : stdout/1000,
			    		network:os.networkInterfaces()
			    	});
					
			    }else{    	
			    	res.end(200);
			    }
			});

		
	});
}