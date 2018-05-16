const { findByToken } = require('../modules/models/user');
const logger = require('../modules/logger');

module.exports = function authenticationMiddleware(req, res, next) {
  const authFail = () => {
    logger.warn('Authentification failed');
    res.sendStatus(401);
  };

  const token = req.headers['x-access-token'];

  if (token == null) {
    return authFail();
  }

  findByToken(token)
    .then(res => {
      if (res) {
        next();
      } else {
        authFail();
      }
    })
    .catch(authFail);
};
