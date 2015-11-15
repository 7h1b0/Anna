const expect 						= require('chai').expect;
const cryptoHelper		= require('./../api/helpers/cryptoHelper');

describe('cryptoHelper', function () {

	describe('.hash', function () {
		it('does hash parameter', function () {
			const hashpassword = cryptoHelper.hash('test');

			expect(hashpassword === 'test').to.be.false;
		})

		it('does generate unique hash', function () {
			const hashedPassword1 = cryptoHelper.hash('test1');
			const hashedPassword2 = cryptoHelper.hash('test2');
			const hashedPassword3 = cryptoHelper.hash('test1');

			expect(hashedPassword1 === hashedPassword2).to.be.false;
			expect(hashedPassword1 === hashedPassword3).to.be.true;
		});
	});

	describe('.verify', function () {
		it('does return false when password equals hashedPassword', function () {
			expect(cryptoHelper.verify('test', 'test')).to.be.false;
		});

		it('does return true when hashed password equals hashedPassword', function () {
			const hashedPassword = cryptoHelper.hash('test');
			expect(cryptoHelper.verify('test', hashedPassword)).to.be.true;
		});
	});

	describe('.random', function () {
		it('does return random String', function () {
			const random1 = cryptoHelper.random();
			const random2 = cryptoHelper.random();

			expect(random1 === random2).to.be.false;
		});

		it('does return a string of 18 caracters', function () {
			expect(cryptoHelper.random(18)).to.have.length(18);
		})
	})
});