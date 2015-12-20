'use strict';

const request = require('./../services/requestService');

class HueService {
	constructor(hostname, username, port){
		this.host = `http://${hostname}:${port}/api/${username}`;
	}

	_toArray(jsonObject) {
		const ids = Object.keys(jsonObject);
		return ids.map(id => {
			let object = jsonObject[id];
			object.id = id;
			return object;
		});
  }

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
}

module.exports = HueService;