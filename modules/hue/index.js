const HueApi		= require('./modules/hue-api');

const light		= require('./controllers/light');
const group		= require('./controllers/group');
const schedule	= require('./controllers/schedule');
const scene 	= require('./controllers/scene');


exports.init = function(app){

	const config = app.get('config').hue;
	const api =  new HueApi(config.hostname, config.username);

	light.init(app, api);
	group.init(app, api);
	schedule.init(app, api);
	scene.init(app, api);
}