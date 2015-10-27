const expect 					= require('chai').expect;
const sinon 					= require('sinon');
const ProcessService 	= require('./../api/services/processService');

describe('ProcessService', function () {

	var processService = new ProcessService();

	describe('Properties', function () {
		it('does have add function', function () {
			expect(processService).to.have.property('add').that.is.a.function;
		});

		it('does have run function', function () {
			expect(processService).to.have.property('run').that.is.a.function;
		});

		it('does have execute function', function () {
			expect(processService).to.have.property('execute').that.is.a.function;
		});

		it('does have queue array property', function () {
			expect(processService).to.have.property('queue').that.is.instanceof(Array);
		});
	});

	describe('#add', function () {
		beforeEach(function () {
			this.spy = sinon.spy(processService, 'run');
		})

		afterEach(function () {
			processService.run.restore();
			processService = new ProcessService();
		});

		it('does call run', function () {
			processService.add({});
			expect(this.spy.calledOnce).to.be.true;
		});

		it('does not call run', function () {
			processService.queue.push({});
			processService.add({});
			expect(this.spy.callCount).to.be.equals(0);
		});

		it('does push process into queue', function () {
			processService.queue.push({});
			processService.add(1, true);

			expect(processService.queue.length).to.be.equals(2);
			expect(processService.queue).to.include({
				device: 1,
				switchOn: true
			});
		});
	});

	describe('#run', function () {
		beforeEach(function () {
			this.spy = sinon.spy(processService, 'execute');
		});

		afterEach(function () {
			processService.execute.restore();
			processService = new ProcessService();
		});

		it('does call execute', function () {
			processService.queue = [{
				device: 1,
				switchOn: true
			}];

			processService.run();

			expect(this.spy.calledOnce).to.be.true;
		});

		it('does call execute with argument', function () {
			processService.queue = [{
				device: 1,
				switchOn: true
			}];

			processService.run();
			expect(this.spy.withArgs('./radioEmission 1 1').calledOnce).to.be.true;

			processService.queue = [{
				device: 1,
				switchOn: false
			}];

			processService.run();
			expect(this.spy.withArgs('./radioEmission 1 0').calledOnce).to.be.true;
		})
	});

	describe('#run', function () {
		it('does return a Promise', function () {
			expect(processService.execute('ls')).to.be.instanceof(Promise);
		});

		it.skip('does call exec', function (done) {
			const childProcess = require('child_process');
			var spy = sinon.spy(childProcess, 'exec');
			processService.execute('ls').then(function () {
				expect(spy.calledOnce).to.be.true;
				done();
			});
		});
	});

});