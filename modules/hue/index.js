var config 		= require('./config');
var HueApi		= require('./modules/hue-api');

var light		= require('./controllers/light');
var group		= require('./controllers/group');
var schedule	= require('./controllers/schedule');
var scene 		= require('./controllers/scene');


exports.init = function(app){

	var api =  new HueApi(config.hostname, config.username);

	light.init(app, api);
	group.init(app, api);
	schedule.init(app, api);
	scene.init(app, api);
}