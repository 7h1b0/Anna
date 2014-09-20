var process = require('./process'),
	config = require(__dirname + '/../config/config.json');

exports.init = function(app){
	app.route('/power').get(function(req,res,next){

		if(req.param('token') == config.tokenPower){
			var script = 'transmit 0 ' + req.param('id') + ' ' + req.param('status');
			process.exec(script);
			res.status(200).end();

		}else{
			next();
		}
	});
}