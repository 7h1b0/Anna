var config 		= require('./config');
var HueApi		= require('./hue-api');

var light		= require('./controller/light');
var group		= require('./controller/group');
var schedule	= require('./controller/schedule');
var scene 		= require('./controller/scene');


exports.init = function(app){

	var api =  new HueApi(config.hostname, config.username);

	light.init(app, api);
	group.init(app, api);
	schedule.init(app, api);
	scene.init(app, api);
}