const Log = require('../models/log');
const User = require('../models/user');

function saveToBDD({ method = 'Unknown', ip = 'Unknown', originalUrl = 'Unknown' }, username = 'Unknown') {
  const log = new Log({
    httpMethod: method,
    path: originalUrl,
    ip,
    username,
  });
  log.save().catch(() => console.error(`${method} - ${originalUrl}`));
}

module.exports = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (token) {
    User.findOne({ token })
      .select('username')
      .then(user => saveToBDD(req, user.username), () => saveToBDD(req))
      .catch(err => console.error(err));
  } else {
    saveToBDD(req);
  }

  next();
};
