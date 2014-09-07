var process = require('./process'),
	config = require('../config/config.json');

exports.init = function(app){
	app.route('/activity').get(function(req,res,next){
		
		if(req.param('token') == config.tokenActivity){
			var script = req.param('name') + '.sh';
			process.exec(script);
			res.render('ok',{script : script});	
			
		}else{
			next();
		}
	});
}