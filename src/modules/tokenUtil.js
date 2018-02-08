const User = require('../models/user');

module.exports = {
  isValid(token = '') {
    return User.findOne({ token })
      .select('token')
      .then(foundToken => foundToken || Promise.reject());
  },
};
