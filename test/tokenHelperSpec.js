const expect = require('chai').expect;
const User = require('./../api/models/user');

describe('User', () => {

  describe('.isValid', () => {
    it('does return a Promise', () => {
      expect(User.isValid()).to.be.instanceof(Promise);
    })

    it('does reject promise if token is invalid', () => {
      expect(User.isValid('test')).to.be.rejected;
    });
  });
});