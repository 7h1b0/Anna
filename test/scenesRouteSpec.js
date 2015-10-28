const request 	= require('supertest');
const app				= require('./../anna');
const expect 		= require('chai').expect;
const sinon 		= require('sinon');

describe('Scene route', function () {

	describe('GET /scene', function () {
		it('does return an array', function (done) {
			request(app)
	      .get('/scene')
	      .expect(200)
	      .expect(function (res) {
	      	expect(res.body).to.be.instanceof(Array);
	      })
	      .end(done);
		});
	});

	describe('POST /scene', function () {
		const scene = {
			"name": "mocha",
			"description": "supertest and mocha",
			"actions": [{
				"path":"/path/path",
				"method": "GET",
				"body": ""
			}]
		};

		it('does return status 400 when sending bad request', function (done) {
			request(app)
				.post('/scene')
				.expect(400, done);
		});

		it('does return the new scene', function (done) {
			request(app)
				.post('/scene')
				.type('json')
				.send(scene)
				.expect(function (res) {
					expect(res.body).to.have.property('name', 'mocha');
					expect(res.body).to.have.property('description', 'supertest and mocha');
					expect(res.body).to.have.property('actions').that.is.instanceof(Array);
				})
				.end(done)
		});

		it('does call save on Scene model');
	});

	describe('GET /scene/id_scene', function () {

		const scene = {
			"name": "mocha",
			"description": "GET /scene/id_scene test",
			"actions": [{
				"path":"/path/path",
				"method": "GET",
				"body": ""
			}]
		};

		before(function (done) {
			request(app)
				.post('/scene')
				.type('json')
				.send(scene)
				.end((err, res) => {
					this.id = res.body._id;
					done();
				});
		});

		after(function (done) {
			const url = '/scene/' + this.id;
			request(app)
				.delete(url)
				.end(done);
		});

		it('does return 404 if not found', function (done) {
			request(app)
				.get('/scene/123456789012345678901234')
				.expect(404, done);
		});

		it('does return a scene', function (done) {
			const url = '/scene/' + this.id;
			request(app)
				.get(url)
				.expect(200)
				.expect(res => {
					expect(res.body).to.have.property('_id', this.id);
					expect(res.body).to.have.property('name', 'mocha');
					expect(res.body).to.have.property('description', 'GET /scene/id_scene test');
					expect(res.body).to.have.property('actions').that.is.instanceof(Array);
					expect(res.body).to.have.deep.property('actions[0].method').to.be.equals('GET');
					expect(res.body).to.have.deep.property('actions[0].path').to.be.equals('/path/path')
					expect(res.body).to.have.deep.property('actions[0].body').to.be.equals('');
				})
				.end(done)
		});
	});

	describe('PUT /scene/id_scene', function () {
		it('does return 500 when sending bad request');

		it('does return 404 if not found');

		it('does return the updated scene');

		it('does call findByIdAndUpdate on Scene model');
	});

	describe('DELETE /scene/id_scene', function () {
		it('does return 404 if not found');

		it('does call findByIdAndRemove on Scene model');
	});

	describe('GET /scene/id_scene/action', function () {
		it('does return 404 if not found');

		it('does call makeHTTPCalls');
	})
});