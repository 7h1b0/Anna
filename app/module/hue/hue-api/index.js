var requestUtil		= require('./requestUtil');
var routeApi		= require('./routeApi');

function HueApi(config){
	this.config = config;
}

module.exports = function (hostname, username, port, timeout, scene_prefix){
	var config = {
		hostname: hostname,
		username: username,
		port: port || 80,
		timeout: timeout || 2000,
		scene_prefix: scene_prefix || "anna"
	}
	return new HueApi(config);
};

HueApi.prototype = {
	config: {},

	_setId: function (id){
		var options = this.config;
		options.id = id;
		return options;
	},

	_getNextSceneId: function (cb){
		var self = this;

		this.getScenes(function (err, result, scenes){
			console.log(self.config.scene_prefix);
			var maxId = -1;
			if (scenes) {
				var ids = Object.keys(scenes);
				ids.forEach(function (id){
	                if (id.indexOf(self.config.scene_prefix) === 0) {
	                    try {
	                        id = Number(id.substr(self.config.scene_prefix.length));
	                        maxId = Math.max(id, maxId);
	                    } catch (ignored) {}
	                }
	            });
			}
			maxId++;
			cb(self.config.scene_prefix + "_" + maxId);
		});
	},

	getLights: function (cb){
		var route = routeApi.getLights.create(this.config);
		requestUtil(route, cb);
	},

	getLight: function (id, cb){
		var options = this._setId(id);
		var route = routeApi.getLight.create(options);

		requestUtil(route, cb);
	},

	renameLight: function (id, content, cb){
		var options = this.setId(id);
	    var route = routeApi.renameLight.create(options, content);

		requestUtil(route, cb);
	},

	setLightState: function (id, content, cb){
		var options = this.setId(id);
		var route = routeApi.setLightState.create(options, content);

		requestUtil(route, cb);
	},

	switchLight: function (id, on, cb){
		this.setLightState(id, {"on": on}, cb);
	},

	getGroups: function (cb){
		var route = routeApi.getGroups.create(this.config);
		requestUtil(route, cb);
	},

	addGroup: function (content, cb){
		var route = routeApi.addGroup.create(this.config, content);
		requestUtil(route, cb);
	},

	getGroup: function (id, cb){
		var options = this.setId(id);
		var route = routeApi.getGroup.create(options);

		requestUtil(route, cb);
	},

	setGroup: function (id, content, cb){
		var options = this.setId(id);
		var route = routeApi.setGroup.create(options, content);

		requestUtil(route, cb);
	},

	setGroupState: function (id, content, cb){
		var options = this.setId(id);
		var route = routeApi.setGroupState.create(options, content);

		requestUtil(route, cb);
	},

	switchGroupOn: function (id, on, cb){
		this.setGroupState(id, {"on": on}, cb);
	},

	deleteGroup: function (id, cb){
		var options = this.setId(id);
		var route = routeApi.deleteGroup.create(this.config);

		requestUtil(route, cb);
	},

	getSchedules: function (cb){
		var route = routeApi.getSchedules.create(this.config);
		requestUtil(route, cb);
	},

	addSchedule: function (content, cb){
		var route = routeApi.addSchedule.create(this.config, content);
		requestUtil(route, cb);
	},

	getSchedule: function (id, cb){
		var options = this.setId(id);
		var route = routeApi.getSchedule.create(options);

		requestUtil(route, cb);
	},

	setSchedule: function (id, content, cb){
		var options = this.setId(id);
		var route = routeApi.setSchedule.create(options, content);

		requestUtil(route, cb);
	},

	deleteSchedule: function (id, cb){
		var options = this.setId(id);
		var route = routeApi.deleteSchedule.create(options);

		requestUtil(route, cb);
	},

	getScenes: function (cb){
		var route = routeApi.getScenes.create(this.config);
		requestUtil(route, cb);
	},

	addScene: function (content, cb){
		this._getNextSceneId(function (id){
			this.setScene(id, content, cb);
		});
	},

	// TODO getScene

	setScene: function (id, content, cb){
		var options = this.setId(id);
		var route = routeApi.addScene.create(options, content);

		requestUtil(route, cb);
	},

	setSceneState: function (id, id_light, content, cb){
		var options = this.setId(id);
		options.id_light = id_light;
		var route = routeApi.setSceneState.create(options);

		requestUtil(route, cb);
	},

	switchScene: function (id, on, cb){
		this.setSceneState(0, {"on": on, "scene": id}, cb);
	}

}

