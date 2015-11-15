const request = require('request');

module.exports = {

	header: { Accept: 'application/json' },

	get(url) {
		const route = this.getRoute(url, 'GET');
		return this.request(route);
	},

	put(url, body) {
		const route = this.getRoute(url, 'PUT', body);
		return this.request(route);
	},

	post(url, body) {
		const route = this.getRoute(url, 'POST', body);
		return this.request(route);
	},

	delete(url) {
		const route = this.getRoute(url, 'DELETE');
		return this.request(route);
	},

	addToken(token) {
		if (token) {
			this.header['x-access-token'] = token;
		}
		return this;
	},

	getRoute(url, method, body) {

    var route = {
      headers:    this.header,
      method:     method || 'GET',
      url:        url,
      timeout:    2000
    };

    if (body) {
      route.json = true;
      route.body = body;
    }
		return route;
	},

	request(route){
		return new Promise((resolve, reject) => {
			request(route, (err, res, body) => {
				if (body) {
					try {
						body = JSON.parse(body);
					} catch (ignored) {} // Body is already a valid JSON
				}

				if (Array.isArray(body) && body[0].error) {
					err = body[0].error;
				}

				if (err) {
					reject(err);
				} else {
					resolve(body);
				}
			});
		});
	}
}