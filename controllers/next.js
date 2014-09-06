var fs = require('fs');

exports.init = function(app){
	app.route('/').get(function(req,res,next){

		var weather = JSON.parse(fs.readFileSync('config/weather.json', 'utf8'));
		
		res.render('next',{min : weather.min, max: weather.max, main: weather.main, icon : weather.icon});	
	});
}