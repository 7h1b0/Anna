var process = require('./process')
	, config = require('../config/config.json');

exports.init = function(app){
	app.route('/power').get(function(req,res,next){

		if(req.param('token') == config.tokenPower){
			var script = 'power.sh ' + req.param('id') + ' ' + req.param('status');
			process.exec(script);
			res.render('ok',{script : script});	

		}else{
			next();
		}
	});
}