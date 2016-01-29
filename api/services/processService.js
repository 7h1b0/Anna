'use strict';
const exec = require('child_process').exec;

class ProcessService {
	constructor() {
		this.queue = [];
	}

	add(device, switchOn) {		
		this.queue.push({
			device,
			switchOn
		});

		if (this.queue.length == 1) {
			this.run();
		}
	}

	run() {
		if (this.queue.length == 0) {
			return;
		}

		const at 			= this.queue[0];
		const status 	= at.switchOn ? 1 : 0;
		const device 	= at.device;
		const script	= `./radioEmission ${device} ${status}`;

		this.execute(script)
			.catch(error => console.log(error))
			.then(() => {
				this.queue.shift();
				this.run();
			});
	}

	execute(script) {
		return new Promise((resolve, reject) => {
			exec(script, (error, stdout, stderr) => {
				error ? reject(stderr) : resolve(stdout);
			});
		});
	}
}

module.exports = ProcessService;