const expect 					= require('chai').expect;
const sinon 					= require('sinon');
const RequestService 	= require('./../api/services/requestService');

describe('RequestService', () => {

	const url = 'http://localhost';
	const body = {data: "7h1b0"};

	describe('Properties', () => {
		it('does have request function', () => {
			expect(RequestService).to.have.property('request').that.is.a.function;
		});

		it('does have getRoute function', () => {
			expect(RequestService).to.have.property('getRoute').that.is.a.function;
		});		

		it('does have get function', () => {
			expect(RequestService).to.have.property('get').that.is.a.function;
		});

		it('does have put function', () => {
			expect(RequestService).to.have.property('put').that.is.a.function;
		});

		it('does have delete function', () => {
			expect(RequestService).to.have.property('delete').that.is.a.function;
		});

		it('does have post function', () => {
			expect(RequestService).to.have.property('post').that.is.a.function;
		});
	});

	describe('.getRoute()', () => {
		it('does return an object', () => {
			expect(RequestService.getRoute(url, 'GET')).to.be.object;
		});

		it('does return GET method by default', () => {
			const route = RequestService.getRoute(url);

			expect(route).to.have.property('method');
			expect(route.method).to.be.equals('GET');
		});

		it('does return a route with no body', () => {
			expect(RequestService.getRoute(url)).to.not.have.property('body');
		});

		it('does return a route with a body', () => {
			const route = RequestService.getRoute(url, 'POST', body);

			expect(route).to.have.property('body');
			expect(route).to.have.property('json');
		});
	});

	describe('.request', () => {
		// ...
	});

	describe('.get()', () => {	
		it('does return a Promise', () => {
			expect(RequestService.get(url)).to.be.instanceof(Promise);
		});

		it('does call getRoute function with two arguments', () => {
			var spy = sinon.spy(RequestService, 'getRoute');
			RequestService.get(url);
			
			expect(spy.withArgs(url, 'GET').calledOnce).to.be.true;
			RequestService.getRoute.restore();
		});

		it('does call request function with a route argument ', () => {
			var spy = sinon.spy(RequestService, 'request');
			RequestService.get(url);

			const route = RequestService.getRoute(url, 'GET');

			expect(spy.withArgs(route).calledOnce).to.be.true;
			RequestService.request.restore();
		});
	});

	describe('.put()', () => {
		it('does return a Promise', () => {
			expect(RequestService.put(url, body)).to.be.instanceof(Promise);
		});

		it('does call getRoute function with three arguments', () => {
			var spy = sinon.spy(RequestService, 'getRoute');
			RequestService.put(url, body);
			
			expect(spy.withArgs(url, 'PUT', body).calledOnce).to.be.true;
			RequestService.getRoute.restore();
		});

		it('does call request function with a route argument ', () => {
			var spy = sinon.spy(RequestService, 'request');
			RequestService.put(url, body);

			const route = RequestService.getRoute(url, 'PUT', body);

			expect(spy.withArgs(route).calledOnce).to.be.true;
			RequestService.request.restore();
		});
	});

	describe('.delete()', () => {
		it('does return a Promise', () => {
			expect(RequestService.delete(url)).to.be.instanceof(Promise);
		});

		it('does call getRoute function with two arguments', () => {
			var spy = sinon.spy(RequestService, 'getRoute');
			RequestService.delete(url);
			
			expect(spy.withArgs(url, 'DELETE').calledOnce).to.be.true;
			RequestService.getRoute.restore();
		});

		it('does call request function with a route argument ', () => {
			var spy = sinon.spy(RequestService, 'request');
			RequestService.delete(url);

			const route = RequestService.getRoute(url, 'DELETE');

			expect(spy.withArgs(route).calledOnce).to.be.true;
			RequestService.request.restore();
		});
	});

	describe('.post()', () => {
		it('does return a Promise', () => {
			expect(RequestService.post(url, body)).to.be.instanceof(Promise);
		});

		it('does call getRoute function with three arguments', () => {
			var spy = sinon.spy(RequestService, 'getRoute');
			RequestService.post(url, body);
			
			expect(spy.withArgs(url, 'POST', body).calledOnce).to.be.true;
			RequestService.getRoute.restore();
		});

		it('does call request function with a route argument ', () => {
			var spy = sinon.spy(RequestService, 'request');
			RequestService.post(url, body);

			const route = RequestService.getRoute(url, 'POST', body);

			expect(spy.withArgs(route).calledOnce).to.be.true;
			RequestService.request.restore();
		});
	});

});