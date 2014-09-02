var process = require('./process')
	, config = require('../config/config.json');

exports.init = function(app){
	app.route('/activity').get(function(req,res){
		if(req.param('token') == config.tokenActivity){
			var script = req.param('name') + '.sh';
			process.exec(script);
			res.render('ok',{script : script});	
			
		}else{
			console.log(new Date() + 'Fail token');
			res.status(404).render('404.jade');
		}
	});
}