const Log = require('../models/log');
const User = require('../models/user');

function saveToBDD(req, username = '') {
  const log = new Log({
    ip: req.ip || 'unknown',
    httpMethod: req.method,
    path: req.originalUrl,
    username,
  });
  log.save().catch(() => console.log(`${req.method} - ${req.originalUrl}`));
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
