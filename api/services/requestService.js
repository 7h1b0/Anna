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

  getRoute(url, method = 'GET', body) {
    const route = {
      headers: this.header,
      timeout: 2000,
      method,
      url,
    };

    if (body) {
      route.json = true;
      route.body = body;
    }
    return route;
  },

  request(route) {
    return new Promise((resolve, reject) => {
      request(route, (err, res, body) => {
        let json = body;
        if (body) {
          try {
            json = JSON.parse(body);
          } catch (ignored) {} // Body is already a valid JSON
        }

        let error;
        if (Array.isArray(json) && json[0].error) {
          error = json[0].error;
        }

        if (error) {
          reject(error);
        } else {
          resolve(json);
        }
      });
    });
  },
};
