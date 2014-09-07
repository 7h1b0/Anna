var fs = require('fs');

exports.init = function(app){
	app.route('/').get(function(req,res,next){

		var weather = JSON.parse(fs.readFileSync('config/weather.json', 'utf8')),
			alarm = JSON.parse(fs.readFileSync('config/alarm.json', 'utf8'));
		
		res.render('index',{min : weather.min, 
							max: weather.max, 
							main: weather.main,
							icon : weather.icon,
							day : alarm.day,
							month : alarm.month +1,
							hour : alarm.hour,
							min : alarm.min
		});	
	});
}