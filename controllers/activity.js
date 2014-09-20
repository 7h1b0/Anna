var process = require('./process'),
	config = require(__dirname + '/../config/config.json');

exports.init = function(app){
	app.route('/activity').get(function(req,res,next){
		
		if(req.param('token') == config.tokenActivity){
			var script = req.param('name') + '.sh';
			process.exec(script);
			res.status(200).end();
			
		}else{
			next();
		}
	});
}