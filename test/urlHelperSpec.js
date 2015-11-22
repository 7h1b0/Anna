const expect 				= require('chai').expect;
const sinon 				= require('sinon');
const UrlHelper 		= require('./../api/helpers/urlHelper');

describe.only('UrlHelper', function () {

	describe('.getUrl', function () {
		const hostname 			= '7h1b0';
		const port 					= 80;
		const simplePath 		= '/blog';
		const complexePath	= '/blog/<id>/<wrong/parameter>';
		const parameter 		= {id: '1234'};

		it('does return an url', function () {
			const url = `http://${hostname}:${port}${simplePath}`;

			expect(UrlHelper.getUrl(hostname, port, simplePath)).to.be.equals(url);
		});	

		it('does handle no path', function () {
			const url = `http://${hostname}:${port}`;

			expect(UrlHelper.getUrl(hostname, port)).to.be.equals(url);
		});

		it('does handle just one argument', function () {
			const url = `http://${hostname}:80`;

			expect(UrlHelper.getUrl(hostname)).to.be.equals(url);
		});

		it('does call getResolvedPath', function () {
			var spy = sinon.spy(UrlHelper, 'getResolvedPath');

			UrlHelper.getUrl(hostname, port, complexePath, parameter);
			expect(spy.calledOnce).to.be.true;
			UrlHelper.getResolvedPath.restore();
		});
	});
	
	describe('.extractParameters', function () {
		it('does return an object with 2 keys', function () {
			const path = '/api/<username>/<id>/<wrong/parameter>';
			expect(UrlHelper.extractParameters(path)).to.be.instanceof(Array).that.have.length(2);
		});

		it('does return an empty object', function () {
			const path = '/api/7h1b0';
			expect(UrlHelper.extractParameters(path)).to.be.instanceof(Array).that.have.length(0);
		});

		it('does return an array with username and id', function () {
			const path = '/api/<username>/<id>/<wrong/parameter>';
			expect(UrlHelper.extractParameters(path)).to.have.members(['username', 'id']);
		});
	});


	describe('.getResolvedPath', function () {
		const simplePath 		= '/api/7h1b0';
		const complexePath 	= '/api/<username>/<id>/<wrong_parameter'

		it('does return a path', function () {
			expect(UrlHelper.getResolvedPath(simplePath)).to.be.equals(simplePath);
		});

		it('does return a resolved path', function () {
			const parameters = {
				username: '7h1b0',
				id: '123'
			}

			const resolvedPath = UrlHelper.getResolvedPath(complexePath, parameters);
			expect(resolvedPath).to.be.equals('/api/7h1b0/123/<wrong_parameter');
		});		

		it('does handle undefined parameters', function () {
			expect(UrlHelper.getResolvedPath.bind(complexePath)).to.throw(Error);
		});	
	});

});