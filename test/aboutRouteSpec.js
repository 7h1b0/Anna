const request 	= require('supertest');
const app				= require('./../anna');
const expect 		= require('chai').expect;

describe('AboutRoute', function () {

	describe('GET /os', function () {
		it('does return an JSON', function (done) {
			request(app)
	      .get('/os')
	      .expect(200)
	      .expect(function (res) {
	      	expect(res.body).to.be.json;
	      })
	      .end(done);
		});

		it('does return an JSON with properties : release, hostname, uptime, cpus, loadavg, totalmem, freemem, nodejs', function (done) {
			request(app)
				.get('/os')
				.expect(200)
				.expect(function (res) {
					expect(res.body).to.be.json;
					expect(res.body).to.have.property('release');
					expect(res.body).to.have.property('hostname');
					expect(res.body).to.have.property('uptime');
					expect(res.body).to.have.property('cpus');
					expect(res.body).to.have.property('loadavg');
					expect(res.body).to.have.property('totalmem');
					expect(res.body).to.have.property('freemem');
					expect(res.body).to.have.property('nodejs');
				})
				.end(done);
		});
	});

	describe('GET /configuration', function () {
		it.skip('does return an JSON', function (done) {
			request(app)
				.get('/configuration')
				.expect(200)
				.expect(function (res) {
					expect(res.body).to.be.json;
				})
				.end(done);
		});

		it.skip('does return an JSON with properties scenes that is an array', function (done) {
			request(app)
				.get('/configuration')
				.expect(200)
				.expect(function (res) {
					expect(res.body).to.have.property('scenes').that.is.instanceof(Array);
				})
				.end(done);
		});

		it.skip('does return an JSON with properties timers that is an array', function (done) {
			request(app)
				.get('/configuration')
				.expect(200)
				.expect(function (res) {
					expect(res.body).to.have.property('timers').that.is.instanceof(Array);
				})
				.end(done);
		});

		it.skip('does return an JSON with properties dios that is an array', function (done) {
			request(app)
				.get('/configuration')
				.expect(200)
				.expect(function (res) {
					expect(res.body).to.have.property('dios').that.is.instanceof(Array);
				})
				.end(done);
		});

		it.skip('does return an JSON with properties lights that is an array', function (done) {
			request(app)
				.get('/configuration')
				.expect(200)
				.expect(function (res) {
					expect(res.body).to.have.property('lights').that.is.instanceof(Array);
				})
				.end(done);
		});

	});

});