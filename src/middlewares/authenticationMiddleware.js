const tokenUtil = require('../modules/tokenUtil');
const logger = require('../modules/logger');

module.exports = function authenticationMiddleware(req, res, next) {
  const token = req.headers['x-access-token'];
  tokenUtil
    .isValid(token)
    .then(() => next())
    .catch(() => {
      logger.warn('Authentification failed');
      res.sendStatus(401);
    });
};
