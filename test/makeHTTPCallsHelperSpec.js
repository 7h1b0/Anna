const expect 							= require('chai').expect;
const sinon 							= require('sinon');
const makeHTTPCallsHelper = require('./../api/helpers/makeHTTPCallsHelper');
const Url 								= require('./../api/helpers/urlHelper');
const Request							= require('./../api/services/requestService');

describe('MakeHTTPCallsHelper', function () {

	const body = {"test": "test"};
	const defaultUrl = 'http://localhost:8181/path/path';

	it('does return a Promise', function () {
		const actions = [{
			"path":"/path/path",
			"method": "GET",
			"body": ""
		}];
		
		expect(makeHTTPCallsHelper(actions, 1234)).to.be.instanceof(Promise);
	});

	it('does call Request.get', function () {
		var spy = sinon.spy(Request, 'get');
		const actions = [{
			"path":"/path/path",
			"method": "GET",
			"body": ""
		}];
			
		makeHTTPCallsHelper(actions);
		expect(spy.withArgs(defaultUrl).calledOnce).to.be.true;
		Request.get.restore();
	});

	it('does call Request.delete', function () {
		var spy = sinon.spy(Request, 'delete');
		const actions = [{
			"path":"/path/path",
			"method": "DELETE",
			"body": ""
		}];
			
		makeHTTPCallsHelper(actions);
		expect(spy.withArgs(defaultUrl).calledOnce).to.be.true;
		Request.delete.restore();
	});

	it('does call Request.put', function () {
		var spy = sinon.spy(Request, 'put');
		const actions = [{
			"path":"/path/path",
			"method": "PUT",
			"body": body
		}];
			
		makeHTTPCallsHelper(actions);
		expect(spy.withArgs(defaultUrl, body).calledOnce).to.be.true;
		Request.put.restore();
	});

	it('does call Request.post', function () {
		var spy = sinon.spy(Request, 'post');
		const actions = [{
			"path":"/path/path",
			"method": "POST",
			"body": body
		}];
			
		makeHTTPCallsHelper(actions);
		expect(spy.withArgs(defaultUrl, body).calledOnce).to.be.true;
		Request.post.restore();
	});

	it('does call Request.get two times', function () {
		var spy = sinon.spy(Request, 'get');
		const actions = [{
			"path":"/path/path",
			"method": "GET",
			"body": ""
		},
		{
			"path":"/path/path",
			"method": "GET",
			"body": ""
		},
		];
			
		makeHTTPCallsHelper(actions);
		expect(spy.withArgs(defaultUrl).calledTwice).to.be.true;
		Request.get.restore();
	});

	it('does call Request.get by default', function () {
		var spy = sinon.spy(Request, 'get');
		const actions = [{
			"path":"/path/path",
			"method": "WRONG_METHOD",
			"body": ""
		}];
			
		makeHTTPCallsHelper(actions);
		expect(spy.withArgs(defaultUrl).calledOnce).to.be.true;
		Request.get.restore();
	});

	it('does call Request.get on port 1234', function () {
		var spy = sinon.spy(Request, 'get');
		const url = 'http://localhost:1234/path/path';
		const actions = [{
			"path":"/path/path",
			"method": "GET",
			"body": ""
		}];
			
		makeHTTPCallsHelper(actions, 1234);
		expect(spy.withArgs(url).calledOnce).to.be.true;
		Request.get.restore();
	});

	it('does call getUrl on UrlHelper', function () {
		var spy = sinon.spy(Url, 'getUrl');
		const actions = [{
			"path":"/path/path",
			"method": "GET",
			"body": ""
		}];

		makeHTTPCallsHelper(actions);
		expect(spy.withArgs('localhost', 8181, '/path/path').calledOnce).to.be.true;
	});

	it('does handle if no actions provided', function () {
		expect(makeHTTPCallsHelper()).to.be.undefined;
	});

	it('does handle if actions is not an array', function () {
		expect(makeHTTPCallsHelper(body)).to.be.undefined;
	});
});