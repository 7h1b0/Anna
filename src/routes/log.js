const Log = require('../modules/models/log');

module.exports = app => {
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

  app.get('/api/log', (req, res) => {
    getQuery()
      .then(logs => toTimestamp(logs))
      .then(logs => res.send(logs))
      .catch(err => res.status(500).send({ err }));
  });

  app.get('/api/log/:limit([0-9]+)', (req, res) => {
    getQuery(req.params.limit)
      .then(logs => toTimestamp(logs))
      .then(logs => res.send(logs))
      .catch(err => res.status(500).send({ err }));
  });
};
