const crypto = require('crypto');
const bcrypt = require('bcryptjs');

module.exports = {
  hash(password) {
    const salt = bcrypt.genSaltSync(10);
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  },

  verify(password, hashedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, (err, res) => {
        if (err || !res) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },

  random(length = 24) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(Math.ceil(length / 2), (err, buf) => {
        if (err) {
          reject(err);
        } else {
          resolve(buf.toString('hex'));
        }
      });
    });
  },
};
