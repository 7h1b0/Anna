import { Router } from 'express';
import * as Log from '../modules/models/log';

const routes = Router();
function getQuery(limit = 20) {
  return Log.findWithLimit(limit);
}

function toTimestamp(logs) {
  return logs.map(({ createdAt, ip, httpMethod, path, username }) => {
    return {
      createdAt,
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

export default routes;
