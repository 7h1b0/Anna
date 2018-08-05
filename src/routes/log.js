const routes = require('express').Router();
const Log = require('../modules/models/log');

function getQuery(limit = 20) {
  return Log.findWithLimit(limit);
}

function toTimestamp(logs) {
  return logs.map(({ createdAt, ip, httpMethod, path, username }) => {
    const timestamp = createdAt.getTime();
    return {
      createdAt: timestamp,
      ip,
      httpMethod,
      path,
      username,
    };
  });
}

routes.get('/api/log', (req, res) => {
  getQuery()
    .then(logs => toTimestamp(logs))
    .then(logs => res.json(logs))
    .catch(err => res.status(500).send({ err }));
});

routes.get('/api/log/:limit([0-9]+)', (req, res) => {
  getQuery(req.params.limit)
    .then(logs => toTimestamp(logs))
    .then(logs => res.json(logs))
    .catch(err => res.status(500).send({ err }));
});

module.exports = routes;
