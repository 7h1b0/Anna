const tokenUtil = require('./../utils/tokenUtil');

module.exports = (req, res, next) => {
  const token = req.headers['x-access-token'];
  tokenUtil.isValid(token)
    .then(() => next())
    .catch(() => res.sendStatus(401));
};
