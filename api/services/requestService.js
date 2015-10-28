const request = require('request');

module.exports = {

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

	getRoute(url, method, body) {

    var route = {
      headers:    { Accept: 'application/json' },
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