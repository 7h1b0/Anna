const Log = require('../modules/models/log');
const User = require('../modules/models/user');
const logger = require('../modules/logger');

function saveToBDD(
  { method = 'Unknown', ip = 'Unknown', originalUrl = 'Unknown' },
  username = 'Unknown',
) {
  Log.save({
    httpMethod: method,
    path: originalUrl,
    ip,
    username,
  }).catch(() => logger.error(`${method} - ${originalUrl}`));
}

module.exports = function logMiddleware(req, res, next) {
  const token = req.headers['x-access-token'];

  if (token) {
    User.findByToken(token)
      .then(({ username }) => saveToBDD(req, username), () => saveToBDD(req))
      .catch(logger.error);
  } else {
    saveToBDD(req);
  }

  next();
};
