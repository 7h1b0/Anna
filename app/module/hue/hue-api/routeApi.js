var Route = require('./route');

module.exports = {
	getLights: new Route({
		url: 	"/api/<username>/lights",
		method: "GET"
	}),

	getLight: new Route({
		url: 	"/api/<username>/lights/<id>",
		method: "GET"
	}),

	renameLight: new Route({
		url: 	"/api/<username>/lights/<id>",
		method: "PUT"
	}),

	setLightState: new Route({
		url: 	"/api/<username>/lights/<id>/state",
		method: "PUT"
	}),

	getGroups: new Route({
		url: 	"/api/<username>/groups",
		method: "GET" 
	}),

	addGroup: new Route({
		url: 	"/api/<username>/groups",
		method: "POST"
	}),

	getGroup: new Route({
		url: 	"/api/<username>/groups/<id>",
		method: "GET"
	}),

	setGroup: new Route({
		url: 	"/api/<username>/groups/<id>",
		method: "PUT"
	}),

	setGroupState: new Route({
		url: 	"/api/<username>/groups/<id>/action",
		method: "PUT"
	}),

	deleteGroup: new Route({
		url: 	"/api/<username>/groups/<id>",
		method: "DELETE"
	}),

	getSchedules: new Route({
		url: 	"/api/<username>/schedules",
		method: "GET"
	}),

	addSchedule: new Route({
		url: 	"/api/<username>/schedules",
		method: "POST"
	}),

	getSchedule: new Route({
		url: 	"/api/<username>/schedules/<id>",
		method: "GET"
	}),

	setSchedule: new Route({
		url: 	"/api/<username>/schedules/<id>",
		method: "PUT"
	}),

	deleteSchedule: new Route({
		url: 	"/api/<username>/schedules/<id>",
		method: "DELETE"
	}),

	getScenes: new Route({
		url: 	"/api/<username>/scenes",
		method: "GET"
	}),

	addScene: new Route({
		url: 	"/api/<username>/scenes/<id>",
		method: "PUT"
	}),

	setSceneState: new Route({
		url: 	"/api/<username>/scenes/<id>/lights/<id_light>/state",
		method: "PUT"
	}),

}