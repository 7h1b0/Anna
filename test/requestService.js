const expect = require('chai').expect;
const sinon = require('sinon');
const RequestService = require('./../api/services/requestService');

describe('RequestService', function () {

	const url = 'http://localhost';
	const body = {data: "7h1b0"};

	describe('.getRoute()', function () {

		it.skip('should return an object', function () {
			expect(RequestService.getRoute(url, 'GET')).to.be.an(Object);
		});

		it.skip('should return GET method by default', function () {
			expect(RequestService.getRoute(url)).to.have.property
		});

		it.skip('should return a route with no body', function () {
			expect(RequestService.getRoute(url)).to.have.property
		});

		it.skip('should return a route with a body', function () {
			expect(RequestService.getRoute(url, body)).to.have.property('body');
			expect(RequestService.getRoute(url, body)).to.have.property('json');
		});
	});

	describe('.request', function () {
		// ...
	});

	describe('.get()', function () {
		it('should have get function', function () {
			expect(RequestService).to.have.property('get').that.is.a.function;
		});

		it('should call getRoute function with two arguments', function () {
			var spy = sinon.spy(RequestService, 'getRoute');
			RequestService.get(url);
			
			expect(spy.withArgs(url, 'GET').calledOnce).to.be.true;
			RequestService.getRoute.restore();
		});

		it('should call request function with a route argument ', function () {
			var spy = sinon.spy(RequestService, 'request');
			RequestService.get(url);

			const route = RequestService.getRoute(url, 'GET');

			expect(spy.withArgs(route).calledOnce).to.be.true;
			RequestService.request.restore();
		});
	});

	describe('.put()', function () {
		it('should have put function', function () {
			expect(RequestService).to.have.property('put').that.is.a.function;
		});

		it('should call getRoute function with three arguments', function () {
			var spy = sinon.spy(RequestService, 'getRoute');
			RequestService.put(url, body);
			
			expect(spy.withArgs(url, 'PUT', body).calledOnce).to.be.true;
			RequestService.getRoute.restore();
		});

		it('should call request function with a route argument ', function () {
			var spy = sinon.spy(RequestService, 'request');
			RequestService.put(url, body);

			const route = RequestService.getRoute(url, 'PUT', body);

			expect(spy.withArgs(route).calledOnce).to.be.true;
			RequestService.request.restore();
		});
	});

	describe('.delete()', function () {

		it('should have delete function', function () {
			expect(RequestService).to.have.property('delete').that.is.a.function;
		});

		it('should call getRoute function with two arguments', function () {
			var spy = sinon.spy(RequestService, 'getRoute');
			RequestService.delete(url);
			
			expect(spy.withArgs(url, 'DELETE').calledOnce).to.be.true;
			RequestService.getRoute.restore();
		});

		it('should call request function with a route argument ', function () {
			var spy = sinon.spy(RequestService, 'request');
			RequestService.delete(url);

			const route = RequestService.getRoute(url, 'DELETE');

			expect(spy.withArgs(route).calledOnce).to.be.true;
			RequestService.request.restore();
		});
	});

	describe('.post()', function () {

		it('should have post function', function () {
			expect(RequestService).to.have.property('post').that.is.a.function;
		});

		it('should call getRoute function with three arguments', function () {
			var spy = sinon.spy(RequestService, 'getRoute');
			RequestService.post(url, body);
			
			expect(spy.withArgs(url, 'POST', body).calledOnce).to.be.true;
			RequestService.getRoute.restore();
		});

		it('should call request function with a route argument ', function () {
			var spy = sinon.spy(RequestService, 'request');
			RequestService.post(url, body);

			const route = RequestService.getRoute(url, 'POST', body);

			expect(spy.withArgs(route).calledOnce).to.be.true;
			RequestService.request.restore();
		});
	});

});