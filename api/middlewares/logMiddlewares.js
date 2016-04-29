const Log = require('./../models/log');
const User = require('./../models/user');

function saveToBDD(req, userID = '') {
  const log = new Log({
    ip: req.ip,
    httpMethod: req.method,
    path: req.originalUrl,
    userID,
  });
  log.save();
}

module.exports = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (token) {
    User.find({ token }).select('username')
      .then(userID => saveToBDD(req, userID))
      .catch(err => saveToBDD(req));
  } else {
    saveToBDD(req);
  }

  next();
};
