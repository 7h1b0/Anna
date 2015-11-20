'use strict';

const request 			= require('./../services/requestService');
const urlHelper 		= require('./../helpers/urlHelper');
const SCENE_PREFIX 	= "anna";

class HueService {
	constructor(hostname, username, port){
		this.config = {
			hostname,
			username,
			port,
			scene_prefix: SCENE_PREFIX
		}
	}

	_toArray(jsonObject) {
		const ids = Object.keys(jsonObject);
		let result = [];
		ids.forEach(id => {
			let object = jsonObject[id];
			object.id = id;
			result.push(object);
		});

		return result;
  }

  getLights() {
		const parameters = {
			username: this.config.username
		};
     
    const url = urlHelper.getUrl(this.config.hostname, this.config.port, '/api/<username>/lights', parameters);

		return new Promise((resolve, reject) => {
			request.get(url).then(body => {
				if (body) {
					body = this._toArray(body);
				}
				resolve(body);
			}).catch(err => {
				reject(err);
			});
		});
  }

  getLight(id) {
		const parameters = {
			username: this.config.username,
			id: id
		};
		const url = urlHelper.getUrl(this.config.hostname, this.config.port, '/api/<username>/lights/<id>', parameters);

		return new Promise((resolve, reject) => {
			request.get(url).then(body => {
				resolve(body);
			}).catch(err => {
				reject(err);
			});
		});
	}

	renameLight(id, name) {
		const parameters = {
			username: this.config.username,
			id: id
		};
		const body = {
			"name": name
		};
		const url = urlHelper.getUrl(this.config.hostname, this.config.port, '/api/<username>/lights/<id>', parameters);

		return new Promise((resolve, reject) => {
			request.put(url, body).then(body => {
				resolve(body);
			}).catch(err => {
				reject(err);
			});
		});
	}

	setLightState(id, body) {
		const parameters = {
			username: this.config.username,
			id: id
		};
		const url = urlHelper.getUrl(this.config.hostname, this.config.port, '/api/<username>/lights/<id>/state', parameters);

		return new Promise((resolve, reject) => {
			request.put(url, body).then(body => {
				resolve(body);
			}).catch(err => {
				reject(err);
			});
		});
	}

	switchLight(id, on, cb) {
		return this.setLightState(id, {
			"on": on
		});
	}
}

module.exports = HueService;