var process = require('./../services/processHandler');

exports.init = function(app){

	app.route('/action').get(function(req,res,next){
		console.log(req.query.launch);

		if(req.query.launch !== undefined){

			var script = req.query.launch + '.sh';

			if(req.query.id !== 'undefined' && req.query.status !== 'undefined'){ // Case Power Outlet
				script += ' ' + req.query.id + ' ' + req.query.status;				
			}

			process.exec(script);
			res.json({response:'Action Performed'});
		}else{
			next();
		}

	});
}