const Log = require('./../models/log');

module.exports = (app) => {
  function getQuery(limit = 20) {
    return Log.find({}).sort({ date: 'desc' }).limit(limit);
  }

  function toTimestamp(logs) {
    return new Promise(resolve => {
      const newLogs = logs.map(({ date, ip, httpMethod, path, username }) => {
        const timestamp = new Date(date).getTime();
        return {
          date: timestamp,
          ip,
          httpMethod,
          path,
          username,
        };
      });
      resolve(newLogs);
    });
  }

  app.get('/api/log', (req, res) => {
    getQuery()
      .then(logs => toTimestamp(logs))
      .then(logs => res.send(logs))
      .catch(err => res.status(500).send({ err }));
  });

  app.get('/api/log/:limit([0-9]{1,3})', (req, res) => {
    getQuery(req.params.limit)
      .then(logs => toTimestamp(logs))
      .then(logs => res.send(logs))
      .catch(err => res.status(500).send({ err }));
  });
};
