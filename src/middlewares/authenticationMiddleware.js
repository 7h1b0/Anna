import { findByToken } from '../modules/models/user';
import * as logger from '../modules/logger';

export default async function authenticationMiddleware(req, res, next) {
  const authFail = () => {
    logger.warn('Authentification failed');
    res.sendStatus(401);
  };

  const token = req.headers['x-access-token'];

  if (token == null) {
    return authFail();
  }

  try {
    const user = await findByToken(token);
    if (user) {
      res.locals.user = user;
      return next();
    }
    authFail();
  } catch (error) {
    authFail();
  }
}
