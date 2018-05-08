const { findByToken } = require('../modules/models/user');
const logger = require('../modules/logger');

module.exports = function authenticationMiddleware(req, res, next) {
  const token = req.headers['x-access-token'];
  findByToken(token)
    .then(() => {
      next();
    })
    .catch(err => {
      logger.warn('Authentification failed');
      res.sendStatus(401);
    });
};
