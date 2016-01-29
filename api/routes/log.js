module.exports = router => {

  const DEFAULT_LIMIT     = 20;
  const Log               = require('./../models/log');

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

  function getQuery(limit) {
    if (limit === undefined) {
      limit = DEFAULT_LIMIT;
    }

    return Log.find({}).sort({'date': 'desc'}).limit(limit);
  }
}