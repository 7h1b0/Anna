const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

module.exports = {
  hash(password) {
    const salt = bcrypt.genSaltSync(10);
    return promisify(bcrypt.hash)(password, salt);
  },

  verify(password, hashedPassword) {
    return promisify(bcrypt.compare)(password, hashedPassword);
  },

  random(length = 24) {
    return promisify(crypto.randomBytes)(Math.ceil(length / 2)).then(buf =>
      buf.toString('hex'),
    );
  },
};
