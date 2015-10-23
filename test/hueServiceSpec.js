const expect 					= require('chai').expect;
const sinon 					= require('sinon');
const HueService 			= require('./../api/services/hueService');

describe('HueService', function () {

	describe('#getLights', function () {

	});

	describe('#getLight', function () {

	});

	describe('#renameLight', function () {

	});

	describe('#setLightState', function () {

	});

	describe('#switchLight', function () {

		var spy;

		beforeEach(function () {
			spy = sinon.spy(HueService, 'setLightState');
		})

		afterEach(function () {
			HueService.setLightState.restore();
		});

		it('does call setLightState', function () {
			HueService.switchLight(1, true);
			expect(spy.calledOnce).to.be.true;
		});

		it('does call with two argument', function () {
			const state = {"on": true};

			HueService.switchLight(1, true);
			expect(spy.withArgs(1, state).calledOnce).to.be.true;
		})
	});

});