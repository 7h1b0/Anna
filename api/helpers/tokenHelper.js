const User = require('./../models/user');

module.exports = {
  isValid(token) {
    return new Promise((resolve, reject) => {
      User.findOne({ token })
        .select('token')
        .then(foundToken => {
          if (!foundToken) {
            reject();
          } else {
            resolve(foundToken);
          }
        })
        .catch(err => reject(err));
    });
  },
};
