const Log = require('./../models/log');

module.exports = router => {
  const DEFAULT_LIMIT = 20;

  function getQuery(limit = DEFAULT_LIMIT) {
    return Log.find({}).sort({ date: 'desc' }).limit(limit);
  }

  router.get('/api/log', (req, res) => {
    getQuery(DEFAULT_LIMIT)
      .then(logs => res.send(logs))
      .catch(err => res.status(500).send(err));
  });

  router.get('/api/log/:limit([0-9]{1,3})', (req, res) => {
    getQuery(req.params.limit)
      .then(logs => res.send(logs))
      .catch(err => res.status(500).send(err));
  });

  router.post('/api/log/search', (req, res) => {
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
      }).catch(err => res.status(500).send(err));
  });
};
