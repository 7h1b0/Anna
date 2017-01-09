const Log = require('../models/log');
const User = require('../models/user');

function saveToBDD({ method, ip, originalUrl }, username = '') {
  const log = new Log({
    ip: ip || 'unknown',
    httpMethod: method,
    path: originalUrl,
    username,
  });
  log.save().catch(() => console.error(`${method} - ${originalUrl}`));
}

module.exports = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (token) {
    User.findOne({ token })
      .select('username')
      .then(user => saveToBDD(req, user.username))
      .catch(() => saveToBDD(req));
  } else {
    saveToBDD(req);
  }

  next();
};
