import http from 'http';
import https from 'https';
import urlParser from 'url';

export function getRoute(url, method = 'GET', body) {
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

export function isSuccess(status) {
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

export function get(url) {
  const route = getRoute(url, 'GET');
  return request(route);
}

export function put(url, body) {
  const route = getRoute(url, 'PUT', body);
  return request(route);
}

export function post(url, body) {
  const route = getRoute(url, 'POST', body);
  return request(route);
}

export function del(url) {
  const route = getRoute(url, 'DELETE');
  return request(route);
}
