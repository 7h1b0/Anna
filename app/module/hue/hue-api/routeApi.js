var Route = require('./../../../utils/route');

module.exports = {
	getLights: new Route(
		"/api/<username>/lights",
		"GET"
	),

	getLight: new Route(
		"/api/<username>/lights/<id>",
		"GET"
	),

	renameLight: new Route(
		"/api/<username>/lights/<id>",
		"PUT"
	),

	setLightState: new Route(
		"/api/<username>/lights/<id>/state",
		"PUT"
	),

	getGroups: new Route(
		"/api/<username>/groups",
		"GET" 
	),

	addGroup: new Route(
		"/api/<username>/groups",
		"POST"
	),

	getGroup: new Route(
		"/api/<username>/groups/<id>",
		"GET"
	),

	setGroup: new Route(
		"/api/<username>/groups/<id>",
		"PUT"
	),

	setGroupState: new Route(
		"/api/<username>/groups/<id>/action",
		"PUT"
	),

	deleteGroup: new Route(
		"/api/<username>/groups/<id>",
		"DELETE"
	),

	getSchedules: new Route(
		"/api/<username>/schedules",
		"GET"
	),

	addSchedule: new Route(
		"/api/<username>/schedules",
		"POST"
	),

	getSchedule: new Route(
		"/api/<username>/schedules/<id>",
		"GET"
	),

	setSchedule: new Route(
		"/api/<username>/schedules/<id>",
		"PUT"
	),

	deleteSchedule: new Route(
		"/api/<username>/schedules/<id>",
		"DELETE"
	),

	getScenes: new Route(
		"/api/<username>/scenes",
		"GET"
	),

	addScene: new Route(
		"/api/<username>/scenes/<id>",
		"PUT"
	),

	setSceneState: new Route(
		"/api/<username>/scenes/<id>/lights/<id_light>/state",
		"PUT"
	),

}