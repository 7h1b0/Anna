const Log = require('../modules/models/log');
const User = require('../modules/models/user');
const logger = require('../modules/logger');

function saveToBDD(
  { method = 'Unknown', ip = 'Unknown', originalUrl = 'Unknown' },
  username = 'Unknown',
) {
  return Log.save({
    httpMethod: method,
    path: originalUrl,
    ip,
    username,
  }).catch(() => logger.error(`${method} - ${originalUrl}`));
}

module.exports = function logMiddleware(req, res, next) {
  const token = req.headers['x-access-token'];

  if (token) {
    User.findByToken(token).then(
      res => saveToBDD(req, res ? res.username : 'Unknown'),
      () => saveToBDD(req),
    );
  } else {
    saveToBDD(req);
  }

  next();
};
