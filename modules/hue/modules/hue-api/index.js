var requestUtil		= require('./../../../../utils/requestUtil');
var routeApi		= require('./routeApi');
const SCENE_PREFIX 	= "anna";

function HueApi(config){
	this.config = config;
}

module.exports = function (hostname, username, port, timeout){
	var config = {
		hostname: hostname,
		username: username,
		port: port || 80,
		timeout: timeout || 2000,
		scene_prefix: SCENE_PREFIX
	}
	return new HueApi(config);
};

HueApi.prototype = {

	_setId: function (id){
		var options = this.config;
		options.id = id;
		return options;
	},

	_getNextSceneId: function (cb){
		this.getScenes((err, result, scenes) => {
			var maxId = -1;
			if (scenes) {
				var ids = Object.keys(scenes);
				ids.forEach((id) => {
	                if (id.startsWith(this.config.scene_prefix)) {
	                    try {
	                        id = Number(id.substr(this.config.scene_prefix.length));
	                        maxId = Math.max(id, maxId);
	                    } catch (ignored) {}
	                }
	            });
			}
			maxId++;
			cb(this.config.scene_prefix + "_" + maxId);
		});
	},

	_toArray: function (jsonObject){
		var ids = Object.keys(jsonObject);
		var result = [];
		ids.forEach(function (id){
			var object = jsonObject[id];
			object.id = id;
			result.push(object);
		});

		return result;
	},

	getLights: function (cb){
		var route = routeApi.getLights
			.setParams(this.config)
			.create();

		requestUtil(route, (err, result, body) => {
			if (body) {
				body = this._toArray(body);
			}
			cb(err, result, body);
		});
	},

	getLight: function (id, cb){
		var options = this._setId(id);
		var route = routeApi.getLight
			.setParams(options)
			.create();

		requestUtil(route, cb);
	},

	renameLight: function (id, body, cb){
		var options = this._setId(id);
	    var route = routeApi.renameLight
		    .setBody(body)
		    .setParams(options)
		    .create();

		requestUtil(route, cb);
	},

	setLightState: function (id, body, cb){
		var options = this._setId(id);
		var route = routeApi.setLightState
			.setBody(body)
			.setParams(options)
			.create();

		requestUtil(route, cb);
	},

	switchLight: function (id, on, cb){
		this.setLightState(id, {"on": on}, cb);
	},

	getGroups: function (cb){
		var route = routeApi.getGroups
			.setParams(this.config)
			.create();
		
		requestUtil(route, (err, result, body) => {
			if (body) {
				body = this._toArray(body);
			}
			cb(err, result, body);
		});
	},

	addGroup: function (body, cb){
		var route = routeApi.addGroup
			.setBody(body)
			.setParams(this.config)
			.create();

		requestUtil(route, cb);
	},

	getGroup: function (id, cb){
		var options = this._setId(id);
		var route = routeApi.getGroup
			.setParams(options)
			.create();

		requestUtil(route, cb);
	},

	setGroup: function (id, body, cb){
		var options = this._setId(id);
		var route = routeApi.setGroup
			.setBody(body)
			.setParams(options)
			.create();

		requestUtil(route, cb);
	},

	setGroupState: function (id, body, cb){
		var options = this._setId(id);
		var route = routeApi.setGroupState
			.setBody(body)
			.setParams(options)
			.create();

		requestUtil(route, cb);
	},

	switchGroupOn: function (id, on, cb){
		this.setGroupState(id, {"on": on}, cb);
	},

	deleteGroup: function (id, cb){
		var options = this._setId(id);
		var route = routeApi.deleteGroup
			.setParams(options)
			.create();

		requestUtil(route, cb);
	},

	getSchedules: function (cb){
		var route = routeApi.getSchedules
			.setParams(this.config)
			.create();

		requestUtil(route, (err, result, body) => {
			if (body) {
				body = this._toArray(body);
			}
			cb(err, result, body);
		});
	},

	addSchedule: function (body, cb){
		var route = routeApi.addSchedule
			.setBody(body)
			.setParams(this.config)
			.create();

		requestUtil(route, cb);
	},

	getSchedule: function (id, cb){
		var options = this._setId(id);
		var route = routeApi.getSchedule
			.setParams(options)
			.create();

		requestUtil(route, cb);
	},

	setSchedule: function (id, body, cb){
		var options = this._setId(id);
		var route = routeApi.setSchedule
			.setBody(body)
			.setParams(options)
			.create();

		requestUtil(route, cb);
	},

	deleteSchedule: function (id, cb){
		var options = this._setId(id);
		var route = routeApi.deleteSchedule
			.setParams(options)
			create();

		requestUtil(route, cb);
	},

	getScenes: function (cb){
		var route = routeApi.getScenes
			.setParams(this.config)
			.create();

		requestUtil(route, (err, result, body) => {
			if (body) {
				body = this._toArray(body);
			}
			cb(err, result, body);
		});
	},

	addScene: function (body, cb){
		this._getNextSceneId(id => {
			this.setScene(id, body, cb);
		});
	},

	// TODO getScene

	setScene: function (id, body, cb){
		var options = this._setId(id);
		var route = routeApi.addScene
			.setBody(body)
			.setParams(options)
			.create();

		requestUtil(route, cb);
	},

	setSceneState: function (id, id_light, body, cb){
		var options = this._setId(id);
		options.id_light = id_light;
		var route = routeApi.setSceneState
			.setParams(options)
			.create();

		requestUtil(route, cb);
	},

	switchScene: function (id, on, cb){
		this.setSceneState(0, {"on": on, "scene": id}, cb);
	}

}

