var process = require('./process');

exports.init = function(app){

	app.route('/action').get(function(req,res,next){

		if(req.param('launch') !== 'undefined'){

			var script = req.param('launch') + '.sh';

			if(req.param('id') !== 'undefined' && req.param('status') !== 'undefined'){ // Case Power Outlet
				script += ' ' + req.param('id') + ' ' + req.param('status');				
			}

			process.exec(script);
			res.json({response:'Action effectuée'});
		}else{
			next();
		}

	});
}