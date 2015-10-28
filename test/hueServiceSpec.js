const expect 					= require('chai').expect;
const sinon 					= require('sinon');
const hostname				= 'localhost';
const port 						= 1234;
const username 				= '7h1b0'
const HueService 			= require('./../api/services/hueService')(hostname, username, port);
const requestService	= require('./../api/services/requestService');

describe('HueService', function () {

	describe('#getLights', function () {

		const body = {"1":{"state":{"on":true,"bri":144,"hue":13088,"sat":212,"xy":[0.5128,0.4147],"ct":467,"alert":"none","effect":"none","colormode":"xy","reachable":true},"type":"Extended color light","name":"Hue Lamp 1","modelid":"LCT001","swversion":"66009461","pointsymbol":{"1":"none","2":"none","3":"none","4":"none","5":"none","6":"none","7":"none","8":"none"}},"2":{"state":{"on":false,"bri":0,"hue":0,"sat":0,"xy":[0,0],"ct":0,"alert":"none","effect":"none","colormode":"hs","reachable":true},"type":"Extended color light","name":"Hue Lamp 2","modelid":"LCT001","swversion":"66009461","pointsymbol":{"1":"none","2":"none","3":"none","4":"none","5":"none","6":"none","7":"none","8":"none"}}};

		it('does call requestService.get', function () {
			var spy = sinon.spy(requestService, 'get');

			HueService.getLights();
			expect(spy.calledOnce).to.be.true;
			requestService.get.restore();
		});

		it('does call requestService.get with valid url', function () {
			var spy = sinon.spy(requestService, 'get');
			const url = `http://${hostname}:${port}/api/${username}/lights`;

			HueService.getLights();
			expect(spy.withArgs(url).calledOnce).to.be.true;
			requestService.get.restore();
		});

		it('does return a Promise', function () {
			expect(HueService.getLights()).to.be.instanceof(Promise);
		});

		it('does return an array of 2', function (done) {
			const stub = sinon.stub(requestService, 'request', function (route) {
				return new Promise((resolve, reject) => {
					resolve(body);
				});
			});

			return HueService.getLights().then(function (lights) {
				expect(lights).to.be.instanceof(Array).that.have.length(2);
				done();
				requestService.request.restore();
			});
		});

		it('does return objects with id property', function (done) {
			const stub = sinon.stub(requestService, 'request', function (route) {
				return new Promise((resolve, reject) => {
					resolve(body);
				});
			});

			return HueService.getLights().then(function (lights) {
				expect(lights[0]).to.have.property('id');
				expect(lights[1]).to.have.property('id');
				done();
				requestService.request.restore();
			});
		});
	});

	describe('#getLight', function () {
		beforeEach(function () {
			this.spy = sinon.spy(requestService, 'get');
		});

		afterEach(function () {
			requestService.get.restore();
		});

		it('does call requestService.get', function () {
			HueService.getLight(1);
			expect(this.spy.calledOnce).to.be.true;
		});

		it('does call requestService.get with valid url', function () {
			const url = `http://${hostname}:${port}/api/${username}/lights/1`;

			HueService.getLight(1);
			expect(this.spy.withArgs(url).calledOnce).to.be.true;
		});

		it('does return a Promise', function () {
			expect(HueService.getLight(1)).to.be.instanceof(Promise);
		});
	});

	describe('#renameLight', function () {
		const name = 'test';

		beforeEach(function () {
			this.spy = sinon.spy(requestService, 'put');
		});

		afterEach(function () {
			requestService.put.restore();
		});

		it('does call requestService.put', function () {
			HueService.renameLight(1, name);
			expect(this.spy.calledOnce).to.be.true;
		});

		it('does call requestService.put with valid arguments', function () {
			const url = `http://${hostname}:${port}/api/${username}/lights/1`;
			const body = {"name": name};

			HueService.renameLight(1, name);
			expect(this.spy.withArgs(url, body).calledOnce).to.be.true;
		});

		it('does return a Promise', function () {
			expect(HueService.renameLight(1, name)).to.be.instanceof(Promise);
		});
	});

	describe('#setLightState', function () {
		const state = {"hue":50000,"on":true,"bri":200};

		beforeEach(function () {
			this.spy = sinon.spy(requestService, 'put');
		});

		afterEach(function () {
			requestService.put.restore();
		});

		it('does call requestService.put', function () {
			HueService.setLightState(1, state);
			expect(this.spy.calledOnce).to.be.true;
		});

		it('does call requestService.put with valid arguments', function () {
			const url = `http://${hostname}:${port}/api/${username}/lights/1/state`;

			HueService.setLightState(1, state);
			expect(this.spy.withArgs(url, state).calledOnce).to.be.true;
		});

		it('does return a Promise', function () {
			expect(HueService.setLightState(1, state)).to.be.instanceof(Promise);
		});
	});

	describe('#switchLight', function () {
		beforeEach(function () {
			this.spy = sinon.spy(HueService, 'setLightState');
		})

		afterEach(function () {
			HueService.setLightState.restore();
		});

		it('does call setLightState', function () {
			HueService.switchLight(1, true);
			expect(this.spy.calledOnce).to.be.true;
		});

		it('does call with two argument', function () {
			const state = {"on": true};

			HueService.switchLight(1, true);
			expect(this.spy.withArgs(1, state).calledOnce).to.be.true;
		});
	});

});