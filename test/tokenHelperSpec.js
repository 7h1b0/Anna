const expect = require('chai').expect;
const tokenHelper = require('./../api/helpers/tokenHelper');

describe('tokenHelper', () => {

  describe('.isValid', () => {
    it('does return a Promise', () => {
      expect(tokenHelper.isValid()).to.be.instanceof(Promise);
    })

    it('does reject promise if token is invalid', () => {
      expect(tokenHelper.isValid('test')).to.be.rejected;
    });
  });
});