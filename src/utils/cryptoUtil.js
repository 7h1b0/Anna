const crypto = require('crypto');
const { password: { iterations, hashBytes, digest } } = require('../../config.json');

const salt = 'xxxxxxxxxxxxxx';

module.exports = {
  hash(password) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, iterations, hashBytes, digest, (err, key) => {
        if (err) {
          reject(err);
        } else {
          resolve(key.toString('base64'));
        }
      });
    });
  },

  verify(password, hashedPassword) {
    return this.hash(password).then((derivedPassword) => {
      if (derivedPassword === hashedPassword) {
        return Promise.resolve();
      }
      return Promise.reject();
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
