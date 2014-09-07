var http = require('http');

exports.get = function(city){
	var url = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+city+"&cnt=1&mode=json&units=metric",
		req = http.get(url, function(res) {
			
	 	console.log("Got response: " + res.statusCode);
	 	var bodyChunks = [];

		res.on('data',function(chunk){
			bodyChunks.push(chunk);
		}).on('end', function() {
	    	var body = Buffer.concat(bodyChunks),
    			parsed_body = JSON.parse(body),
    			iconWeather,
    			iconClass;

	    	iconWeather = parsed_body.list[0].weather[0].icon.substring(0,2);
	    	switch(iconWeather){
	    		case '01':
	    			iconClass="clear";
	    			break;
	    		case '02':
	    			iconClass="few-clouds";
	    			break;
	    		case '03':
	    			iconClass="clours";
	    			break;
	    		case '04':
	    			iconClass="broken-clouds";
	    			break;
	    		case '09':
	    			iconClass="shower-rain";
	    			break;
	    		case '10':
	    			iconClass="rain";
	    			break;
	    		case '11':
	    			iconClass="thunderstorm";
	    			break;
	    		case '13':
	    			iconClass="snow";
	    			break;
	    		case '50':
	    			iconClass="mist";
	    			break;
	    		default :
	    			iconClass="x-mark";
	    	}

	    	weather = {};
	    	weather.min = Math.round(parsed_body.list[0].temp.min);
	    	weather.max = Math.round(parsed_body.list[0].temp.max);
	    	weather.main = parsed_body.list[0].weather[0].main;
	    	weather.icon = iconClass;
	    	write(weather);
	    })
	});

	req.on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};

function write(weather){
	var fs = require('fs');
	string = JSON.stringify(weather);
	fs.writeFile("config/weather.json",string,function(err){ // Asynchronous
		if(err)throw err;
		console.log("Weather Updated");
	});
}
