const expect 					= require('chai').expect;
const sinon 					= require('sinon');
const ProcessService 	= require('./../api/services/processService');

describe('ProcessService', () => {

	var processService = new ProcessService();

	describe('Properties', () => {
		it('does have add function', () => {
			expect(processService).to.have.property('add').that.is.a.function;
		});

		it('does have run function', () => {
			expect(processService).to.have.property('run').that.is.a.function;
		});

		it('does have execute function', () => {
			expect(processService).to.have.property('execute').that.is.a.function;
		});

		it('does have queue array property', () => {
			expect(processService).to.have.property('queue').that.is.instanceof(Array);
		});
	});

	describe('#add', () => {
		beforeEach(() => {
			this.spy = sinon.spy(processService, 'run');
		})

		afterEach(() => {
			processService.run.restore();
			processService = new ProcessService();
		});

		it('does call run', () => {
			processService.add({});
			expect(this.spy.calledOnce).to.be.true;
		});

		it('does not call run', () => {
			processService.queue.push({});
			processService.add({});
			expect(this.spy.callCount).to.be.equals(0);
		});

		it('does push process into queue', () => {
			processService.queue.push({});
			processService.add(1, true);

			expect(processService.queue.length).to.be.equals(2);
			expect(processService.queue).to.include({
				device: 1,
				switchOn: true
			});
		});
	});

	describe('#run', () => {
		beforeEach(() => {
			this.spy = sinon.spy(processService, 'execute');
		});

		afterEach(() => {
			processService.execute.restore();
			processService = new ProcessService();
		});

		it('does call execute', () => {
			processService.queue = [{
				device: 1,
				switchOn: true
			}];

			processService.run();

			expect(this.spy.calledOnce).to.be.true;
		});

		it('does call execute with argument', () => {
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

	describe('#run', () => {
		it('does return a Promise', () => {
			expect(processService.execute('ls')).to.be.instanceof(Promise);
		});
	});

});