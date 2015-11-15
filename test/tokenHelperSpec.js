const expect 						= require('chai').expect;
const tokenHelper				= require('./../api/helpers/tokenHelper');

describe('tokenHelper', function () {

	describe('.isValid', function () {
		it('does return a Promise', function () {
			expect(tokenHelper.isValid()).to.be.instanceof(Promise);
		})

		it('does reject promise if token is invalid', function () {
			expect(tokenHelper.isValid('test')).to.be.rejected;
		});
	});
});