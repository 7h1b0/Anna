const request = require('request');

module.exports = {

	get(url, cb) {
		const route = this.getRoute(url, 'GET');
		this.request(route, cb);
	},

	put(url, body, cb) {
		const route = this.getRoute(url, 'PUT', body);
		this.request(route, cb);
	},

	post(url, body, cb) {
		const route = this.getRoute(url, 'POST', body);
		this.request(route, cb);
	},

	delete(url, cb) {
		const route = this.getRoute(url, 'DELETE');
		this.request(route, cb);
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

	request(route, cb){
		request(route, function (err, res, body) {
			if (body) {
				try {
					body = JSON.parse(body);
				} catch (ignored) {} // Body is already a valid JSON
			}

			if (Array.isArray(body) && body[0].error) {
				err = body[0].error;
			}

			if (cb) {
				cb(err, res, body);
			}
		});
	}
}