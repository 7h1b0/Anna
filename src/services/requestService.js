const http = require('http');
const https = require('https');
const urlParser = require('url');

function getRoute(url, method = 'GET', body) {
  const route = {
    timeout: 2000,
    headers: { Accept: 'application/json' },
    method,
    url,
  };

  if (body) route.body = body;
  return route;
}

function request(route) {
  const SUCCESSFUL = [200, 201, 202, 203, 204, 205, 206];

  function parseRouteUrl() {
    const parsed = urlParser.parse(route.url);
    route.protocol = parsed.protocol;
    route.hostname = parsed.hostname;
    route.path = parsed.path;
    if (parsed.port) route.port = parsed.port;
    delete route.url;
  }

  return new Promise((resolve, reject) => {
    parseRouteUrl(route);
    route.method = route.method.toUpperCase();

    if (!route.headers) route.headers = {};

    let body;
    if (route.body) {
      body = JSON.stringify(route.body);
      route.headers['content-type'] = 'application/json';
      route.headers['content-length'] = Buffer.byteLength(body);
    }

    const protocol = route.protocol === 'https:' ? https : http;
    const req = protocol.request(route, res => {
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', chunk => (rawData += chunk));
      res.on('end', () => {
        if (SUCCESSFUL.includes(res.statusCode)) {
          try {
            resolve(JSON.parse(rawData));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(rawData);
        }
      });
    });
    req.on('error', err => reject(err));
    req.end(body);
    req.setTimeout(route.timeout || 2000, () => reject('timeout'));
  });
}

module.exports = {
  get(url) {
    const route = getRoute(url, 'GET');
    return request(route);
  },

  put(url, body) {
    const route = getRoute(url, 'PUT', body);
    return request(route);
  },

  post(url, body) {
    const route = getRoute(url, 'POST', body);
    return request(route);
  },

  delete(url) {
    const route = getRoute(url, 'DELETE');
    return request(route);
  },
};
