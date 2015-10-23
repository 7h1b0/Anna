const expect 			= require('chai').expect;
const sinon 			= require('sinon');
const ProcessService 	= require('./../api/services/processService');

describe('ProcessService', function () {

	var processService = new ProcessService();

	it('should have add function', function () {
		expect(processService).to.have.property('add').that.is.a.function;
	});

	it('should have run function', function () {
		expect(processService).to.have.property('run').that.is.a.function;
	});

	it('should have execute function', function () {
		expect(processService).to.have.property('execute').that.is.a.function;
	});

	it('should have queue array property', function () {
		expect(processService).to.have.property('queue').that.is.instanceof(Array);
	});

	describe('#add', function () {

		var spy;

		beforeEach(function () {
			spy = sinon.spy(processService, 'run');
		})

		afterEach(function () {
			processService.run.restore();
			processService = new ProcessService();
		});

		it('should call run', function () {
			processService.add({});
			expect(spy.calledOnce).to.be.true;
		});

		it('should not call run', function () {
			processService.queue.push({});
			processService.add({});
			expect(spy.callCount).to.be.equals(0);
		});

		it('should push process into queue', function () {
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

		var spy;

		beforeEach(function () {
			spy = sinon.spy(processService, 'execute');
		});

		afterEach(function () {
			processService.execute.restore();
			processService = new ProcessService();
		});

		it('should call execute', function () {
			processService.queue = [{
				device: 1,
				switchOn: true
			}];

			processService.run();

			expect(spy.calledOnce).to.be.true;
		});

		it('should call execute with argument', function () {
			processService.queue = [{
				device: 1,
				switchOn: true
			}];

			processService.run();
			expect(spy.withArgs('./radioEmission 1 1').calledOnce).to.be.true;

			processService.queue = [{
				device: 1,
				switchOn: false
			}];

			processService.run();
			expect(spy.withArgs('./radioEmission 1 0').calledOnce).to.be.true;
		})
	});

});