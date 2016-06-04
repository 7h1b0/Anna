const Log = require('./../models/log');

module.exports = app => {
  function getQuery(limit = 20) {
    return Log.find({}).sort({ date: 'desc' }).limit(limit);
  }

  app.get('/api/log', (req, res) => {
    getQuery()
      .then(logs => res.send(logs))
      .catch(err => res.status(500).send({ err }));
  });

  app.get('/api/log/:limit([0-9]{1,3})', (req, res) => {
    getQuery(req.params.limit)
      .then(logs => res.send(logs))
      .catch(err => res.status(500).send({ err }));
  });

  app.post('/api/log/search', (req, res) => {
    if (req.body === undefined) {
      res.sendStatus(400);
    }

    Log.find(req.body)
      .then(logs => {
        if (!logs) {
          res.sendStatus(404);
        } else {
          res.send(logs);
        }
      })
      .catch(err => res.status(500).send({ err }));
  });
};
