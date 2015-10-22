const exec = require('child_process').exec;

function ProcessService(){
	this.queue = [];
}

ProcessService.prototype = {

	add(device, switchOn) {		
		this.queue.push({
			device : device,
			switchOn : switchOn
		});

		if (this.queue.length == 1) {
			this.run();
		}
	},

	run() {
		if (this.queue.length < 1) {
			return;
		}

		const at 		= this.queue[0];
		const status 	= at.switchOn ? 1 : 0;
		const device 	= at.device;
		const script	= `./radioEmission ${device} ${status}`;

		this.execute(script).then(function () {
			this.queue.splice(0,1);
			this.run();
		});
	},

	execute(script) {
		return new Promise(function (resolve, reject) {
			exec(script, (error, stdout, stderr) => {
				resolve();
			});
		})
	}
}

module.exports = ProcessService;