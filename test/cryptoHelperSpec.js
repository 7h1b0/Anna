const cryptoHelper = require('./../api/helpers/cryptoHelper');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('cryptoHelper', () => {

  describe('.hash', () => {
    it('does hash parameter', () => {
      const hashpassword = cryptoHelper.hash('test');

      expect(hashpassword === 'test').to.be.false;
    });

    it('does generate unique hash', () => {
      const hashedPassword1 = cryptoHelper.hash('test1');
      const hashedPassword2 = cryptoHelper.hash('test2');
      const hashedPassword3 = cryptoHelper.hash('test1');

      expect(hashedPassword1 === hashedPassword2).to.be.false;
      expect(hashedPassword1 === hashedPassword3).to.be.true;
    });
  });

  describe('.verify', () => {
    it('does return false when password equals hashedPassword', () => {
      expect(cryptoHelper.verify('test', 'test')).to.be.false;
    });

    it('does return true when hashed password equals hashedPassword', () => {
      const hashedPassword = cryptoHelper.hash('test');
      expect(cryptoHelper.verify('test', hashedPassword)).to.be.true;
    });
  });

  describe('.random', () => {
    it('does return random String', () =>  {
      const random1 = cryptoHelper.random();
      const random2 = cryptoHelper.random();

      Promise.all(random1, random2).then(values => expect(values[1] === values[2]).to.be.false);
    });

    it('does return a string of 18 caracters', () =>  {
      expect(cryptoHelper.random(18)).to.eventually.have.length(18);
    });

    it('does return a string of 24 caracters', () => {
      expect(cryptoHelper.random()).to.eventually.have.length(24);
    });
  })
});