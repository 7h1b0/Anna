const request		= require('./requestService');
const SCENE_PREFIX 	= "anna";

function HueService(config){
	this.config = config;
}

module.exports = function (hostname, username, port, timeout){
	const config = {
		hostname: hostname,
		username: username,
		port: port || 80,
		timeout: timeout || 2000,
		scene_prefix: SCENE_PREFIX
	}
	return new HueService(config);
};

HueService.prototype = {

	_setId(id) {
		var options = this.config;
		options.id = id;
		return options;
	},

	_getNextSceneId(cb) {
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

	_toArray(jsonObject) {
		var ids = Object.keys(jsonObject);
		var result = [];
		ids.forEach(function (id){
			var object = jsonObject[id];
			object.id = id;
			result.push(object);
		});

		return result;
	},

	getLights() {
		const route = new Route('/api/<username>/lights', 'GET')
			.setParams(this.config)
			.create();

		return new Promise((resolve, reject) => {
			request(route, (err, res, body) => {
				if (err) {
					reject(err);
				} else {
					if (body) {
						body = this._toArray(body);
					}
					resolve(body);
				}
			});
		});
	},

	getLight: function (id){
		const options = this._setId(id);
		const route = routeApi.getLight
			.setParams(options)
			.create();

		return new Promise((resolve, reject) => {
			request(route, (err, res, body){
				if (err) {
					reject(err);
				} else {
					resolve(body);
				}
			});
	},

	renameLight: function (id, body, cb){
		var options = this._setId(id);
	    var route = routeApi.renameLight
		    .setBody(body)
		    .setParams(options)
		    .create();

		request(route, cb);
	},

	setLightState: function (id, body, cb){
		var options = this._setId(id);
		var route = routeApi.setLightState
			.setBody(body)
			.setParams(options)
			.create();

		request(route, cb);
	},

	switchLight: function (id, on, cb){
		this.setLightState(id, {"on": on}, cb);
	},

	getGroups: function (cb){
		var route = routeApi.getGroups
			.setParams(this.config)
			.create();
		
		request(route, (err, result, body) => {
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

		request(route, cb);
	},

	getGroup: function (id, cb){
		var options = this._setId(id);
		var route = routeApi.getGroup
			.setParams(options)
			.create();

		request(route, cb);
	},

	setGroup: function (id, body, cb){
		var options = this._setId(id);
		var route = routeApi.setGroup
			.setBody(body)
			.setParams(options)
			.create();

		request(route, cb);
	},

	setGroupState: function (id, body, cb){
		var options = this._setId(id);
		var route = routeApi.setGroupState
			.setBody(body)
			.setParams(options)
			.create();

		request(route, cb);
	},

	switchGroupOn: function (id, on, cb){
		this.setGroupState(id, {"on": on}, cb);
	},

	deleteGroup: function (id, cb){
		var options = this._setId(id);
		var route = routeApi.deleteGroup
			.setParams(options)
			.create();

		request(route, cb);
	},

	getSchedules: function (cb){
		var route = routeApi.getSchedules
			.setParams(this.config)
			.create();

		request(route, (err, result, body) => {
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

		request(route, cb);
	},

	getSchedule: function (id, cb){
		var options = this._setId(id);
		var route = routeApi.getSchedule
			.setParams(options)
			.create();

		request(route, cb);
	},

	setSchedule: function (id, body, cb){
		var options = this._setId(id);
		var route = routeApi.setSchedule
			.setBody(body)
			.setParams(options)
			.create();

		request(route, cb);
	},

	deleteSchedule: function (id, cb){
		var options = this._setId(id);
		var route = routeApi.deleteSchedule
			.setParams(options)
			create();

		request(route, cb);
	},

	getScenes: function (cb){
		var route = routeApi.getScenes
			.setParams(this.config)
			.create();

		request(route, (err, result, body) => {
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

		request(route, cb);
	},

	setSceneState: function (id, id_light, body, cb){
		var options = this._setId(id);
		options.id_light = id_light;
		var route = routeApi.setSceneState
			.setParams(options)
			.create();

		request(route, cb);
	},

	switchScene: function (id, on, cb){
		this.setSceneState(0, {"on": on, "scene": id}, cb);
	}

}

