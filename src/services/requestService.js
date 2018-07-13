const http = require('http');
const https = require('https');
const urlParser = require('url');

function getRoute(url, method = 'GET', body) {
  const parsed = urlParser.parse(url);
  const route = {
    timeout: 2000,
    headers: { Accept: 'application/json' },
    method: method.toUpperCase(),
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    path: parsed.path,
    port: parsed.port,
  };

  if (body) route.body = body;
  return route;
}

function isSuccess(status) {
  return status >= 200 && status < 300;
}

function request(route) {
  return new Promise((resolve, reject) => {
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
        if (isSuccess(res.statusCode)) {
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
    req.setTimeout(route.timeout, () => reject('timeout'));
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

  getRoute,
  isSuccess,
};
