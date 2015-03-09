var os = require('os');

exports.init = function(app){

	app.route('/os').get(function(req,res,next){
        res.set('Cache-Control', 'max-age=3600');
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