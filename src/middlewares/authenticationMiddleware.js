const { tokenUtil } = require('../utils/');

module.exports = function authenticationMiddleware(req, res, next) {
  const token = req.headers['x-access-token'];
  tokenUtil
    .isValid(token)
    .then(() => next())
    .catch(() => res.sendStatus(401));
};
