var fs = require('fs'),
	process = require('./process');

exports.check = function(){
	setInterval(function(){
		var date = new Date(),
			day = date.getDate(),
			month = date.getMonth(),
			hour = date.getHours(),
			min = date.getMinutes();

		alarm = JSON.parse(fs.readFileSync('config/alarm.json', 'utf8'));

		if(alarm.month == month && alarm.day == day && alarm.hour == hour && alarm.min == min){
				console.log("------ ALARM ! -------");
				process.exec('alarm.sh');
		}
	},1000*60); // Every 1 minutes
};