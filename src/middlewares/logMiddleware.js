import { save } from '../modules/models/log';
import { findByToken } from '../modules/models/user';
import * as logger from '../modules/logger';

function saveToBDD(
  { method = 'Unknown', ip = 'Unknown', originalUrl = 'Unknown' },
  username = 'Unknown',
) {
  return save({
    httpMethod: method,
    path: originalUrl,
    ip,
    username,
  }).catch(() => logger.error(`${method} - ${originalUrl}`));
}

export default function logMiddleware(req, res, next) {
  const token = req.headers['x-access-token'];

  if (token) {
    findByToken(token).then(
      res => saveToBDD(req, res ? res.username : 'Unknown'),
      () => saveToBDD(req),
    );
  } else {
    saveToBDD(req);
  }

  next();
}
