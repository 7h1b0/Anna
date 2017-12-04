const Log = require('../models/log');
const User = require('../models/user');
const logger = require('../utils/logger');

function saveToBDD(
  { method = 'Unknown', ip = 'Unknown', originalUrl = 'Unknown' },
  username = 'Unknown',
) {
  const log = new Log({
    httpMethod: method,
    path: originalUrl,
    ip,
    username,
  });
  log.save().catch(() => logger.error(`${method} - ${originalUrl}`));
}

module.exports = function logMiddleware(req, res, next) {
  const token = req.headers['x-access-token'];

  if (token) {
    User.findOne({ token })
      .then(({ username }) => saveToBDD(req, username), () => saveToBDD(req))
      .catch(logger.error);
  } else {
    saveToBDD(req);
  }

  next();
};
