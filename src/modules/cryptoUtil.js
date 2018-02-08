const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

module.exports = {
  hash(password) {
    return bcrypt.genSalt(10).then(salt => {
      return bcrypt.hash(password, salt);
    });
  },

  verify(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },

  random(length = 24) {
    return promisify(crypto.randomBytes)(Math.ceil(length / 2)).then(buf =>
      buf.toString('hex'),
    );
  },
};
