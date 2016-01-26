'use strict';

const request = require('./requestService');

class HueService {
	constructor(hostname, username){
		this.hostname = hostname;
		this.username = username;
		this.host = `http://${hostname}/api/${username}`;
	}

	_toArray(jsonObject) {
		const ids = Object.keys(jsonObject);
		return ids.map(id => {
			let object = jsonObject[id];
			object.id = id;
			return object;
		});
  }

  _extractId(jsonArray) {
  	return jsonArray[0].success.id;
  }

  // -----------------------------------------
  // Getters
  getHostname() {
  	return this.hostname;
  }

  getUsername() {
  	return this.username;
  }

  // -----------------------------------------
  // Lights API
  getLights() {
    const url = `${this.host}/lights`;
		return new Promise((resolve, reject) => {
			request.get(url).then(body => {
				if (body) {
					body = this._toArray(body);
				}
				resolve(body);
			}).catch(err => reject(err));
		});
  }

  getLight(id) {
		const url = `${this.host}/lights/${id}`;
		return request.get(url);
	}

	renameLight(id, name) {
		const body = {name};
		const url = `${this.host}/lights/${id}`;

		return request.put(url, body);
	}

	setLightState(id, body) {
		const url = `${this.host}/lights/${id}/state`;
		return request.put(url, body);
	}

	switchLight(id, on) {
		return this.setLightState(id, {on});
	}

	// -----------------------------------------
  // Scenes API
  getScenes() {
    const url = `${this.host}/scenes`;
		return new Promise((resolve, reject) => {
			request.get(url).then(body => {
				if (body) {
					body = this._toArray(body);
				}
				resolve(body);
			}).catch(err => reject(err));
		});
  }

  getScene(id) {
  	const url = `${this.host}/scenes/${id}`;
  	return request.get(url);
  }

  createScene(body) {
  	const url = `${this.host}/scenes`;
    return new Promise((resolve, reject) => {
      request.post(url, body).then(body => {
        const id = this._extractId(body);
        resolve(id);
      }).catch(err => reject(err));
    });
  }

  setScene(id, body) {
  	const url = `${this.host}/scenes/${id}`;
  	return request.put(url, body);
  }

	setSceneLightStates(id, idLight, body) {
		const url = `${this.host}/scenes/${id}/lightstates/${idLight}`;
		return request.put(url, body);
	}  

  deleteScene(id) {
  	const url = `${this.host}/scenes/${id}`;
  	return request.delete(url);
  }

  recallScene(id) {
  	const url = `${this.host}/groups/0/action`;
  	return request.put(url, {"scene": id});
  }

	// -----------------------------------------
  // Schedules API
	getSchedules() {
    const url = `${this.host}/schedules`;

		return new Promise((resolve, reject) => {
			request.get(url).then(body => {
				if (body) {
					body = this._toArray(body);
				}
				resolve(body);
			}).catch(err => reject(err));
		});
  }

  getSchedule(id) {
  	const url = `${this.host}/schedules/${id}`;
  	return request.get(url);
  }

  createSchedule(body) {
  	const url = `${this.host}/schedules`;
  	return new Promise((resolve, reject) => {
  		request.post(url, body).then(body => {
  			const id = this._extractId(body);
  			resolve(id);
  		}).catch(err => reject(err));
  	});
  }

  setSchedule(id, body) {
  	const url = `${this.host}/schedules/${id}`;
  	return request.put(url, body);
  }

  deleteSchedule(id) {
  	const url = `${this.host}/schedules/${id}`;
  	return request.delete(url);
  }

  startSchedule(id) {
  	return this.setSchedule(id, {"status": "enabled"});
  }

  stopSchedule(id) {
  	return this.setSchedule(id, {"status": "disabled"});
  }

  // -----------------------------------------
  // Rules API
	getRules() {
    const url = `${this.host}/rules`;

		return new Promise((resolve, reject) => {
			request.get(url).then(body => {
				if (body) {
					body = this._toArray(body);
				}
				resolve(body);
			}).catch(err => reject(err));
		});
  }

  getRule(id) {
  	const url = `${this.host}/rules/${id}`;
  	return request.get(url);
  }

  createRule(body) {
  	const url = `${this.host}/rules`;
  	return new Promise((resolve, reject) => {
  		request.post(url, body).then(body => {
  			const id = this._extractId(body);
  			resolve(id);
  		}).catch(err => reject(err));
  	});
  }

  setRule(id, body) {
  	const url = `${this.host}/rules/${id}`;
  	return request.put(url, body);
  }

  deleteRule(id) {
  	const url = `${this.host}/rules/${id}`;
  	return request.delete(url);
  }

  // -----------------------------------------
  // Sensors API
	getSensors() {
    const url = `${this.host}/sensors`;

		return new Promise((resolve, reject) => {
			request.get(url).then(body => {
				if (body) {
					body = this._toArray(body);
				}
				resolve(body);
			}).catch(err => reject(err));
		});
  }

  getSensor(id) {
  	const url = `${this.host}/sensors/${id}`;
  	return request.get(url);
  }

  createSensor(body) {
  	const url = `${this.host}/sensors`;
  	return new Promise((resolve, reject) => {
  		request.post(url, body).then(body => {
  			const id = this._extractId(body);
  			resolve(id);
  		}).catch(err => reject(err));
  	});
  }

  setSensor(id, body) {
  	const url = `${this.host}/sensors/${id}`;
  	return request.put(url, body);
  }

  setSensorConfig(id, body) {
  	const url = `${this.host}/sensors/${id}/config`;
  	return request.put(url, body);
  }

  setSensorState(id, body) {
  	const url = `${this.host}/sensors/${id}/state`;
  	return request.put(url, body);
  }

  deleteSensor(id) {
  	const url = `${this.host}/sensors/${id}`;
  	return request.delete(url);
  }
}

module.exports = HueService;