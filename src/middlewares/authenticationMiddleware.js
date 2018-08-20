import { findByToken } from '../modules/models/user';
import * as logger from '../modules/logger';

export default function authenticationMiddleware(req, res, next) {
  const authFail = () => {
    logger.warn('Authentification failed');
    res.sendStatus(401);
  };

  const token = req.headers['x-access-token'];

  if (token == null) {
    return authFail();
  }

  return findByToken(token)
    .then(user => {
      if (user) {
        res.locals.user = user;
        return next();
      }
      authFail();
    })
    .catch(authFail);
}
