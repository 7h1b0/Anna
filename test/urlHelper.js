const expect 			= require('chai').expect;
const sinon 			= require('sinon');
const UrlHelper 		= require('./../api/helpers/urlHelper');

describe('Url Helper', function () {

	describe('#extractParameters', function () {

		it('should return an array of 2', function () {
			const path = '/api/<username>/<id>/<wrong/parameter>';
			const parameters = UrlHelper.extractParameters(path);

			expect(parameters).to.be.instanceof(Array).that.have.length(2);
		});

		it('should return empty array', function () {
			const path = '/api/7h1b0';
			expect(UrlHelper.extractParameters(path)).to.be.instanceof(Array).that.have.length(0);
		});

		it('should contains members username and id', function () {
			const path = '/api/<username>/<id>/<wrong/parameter>';
			const parameters = UrlHelper.extractParameters(path);

			expect(parameters).to.have.members(['username', 'id']);
		});
	});

	describe('#getPath', function () {

		it('should return a path', function () {
			const path = '/api/7h1b0';
			expect(UrlHelper.getPath(path)).to.be.equals(path);
		});

		it('should return a resolved path', function () {
			const path = '/api/<username>/<id>/<wrong_parameter';
			const parameters = {
				username: '7h1b0',
				id: '123'
			}

			const resolvedPath = UrlHelper.getPath(path, parameters);
			expect(resolvedPath).to.be.equals('/api/7h1b0/123/<wrong_parameter');
		});		

		it('should handle undefined parameters', function () {
			const path = '/api/<username>/<id>/<wrong_parameter';
			expect(UrlHelper.getPath.bind(path)).to.throw(Error);
		});
		
	});

	describe('#getUrl', function () {

		const hostname 			= '7h1b0';
		const port 					= 80;
		const path 					= '/blog';
		const pathParameter = '/blog/<id>/<wrong/parameter>';
		const parameter 		= {id: '1234'};

		it('should return an url', function () {
			const url = `http://${hostname}:${port}${path}`;
			expect(UrlHelper.getUrl(hostname, port, path)).to.be.equals(url);
		});

		it('should handle no path', function () {
			const url = `http://${hostname}:${port}`;
			expect(UrlHelper.getUrl(hostname, port)).to.be.equals(url);
		});

		it('should handle just one argument', function () {
			const url = `http://${hostname}:80`;
			expect(UrlHelper.getUrl(hostname)).to.be.equals(url);
		});

		it('should call getPath', function () {
			var spy = sinon.spy(UrlHelper, 'getPath');
			UrlHelper.getUrl(hostname, port, pathParameter, parameter);
			expect(spy.calledOnce).to.be.true;
			UrlHelper.getPath.restore();
		});

	});

});