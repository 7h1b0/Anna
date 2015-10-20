const exec = require('child_process').exec;

function ProcessController(){
	this.process = [];
}

ProcessController.prototype = {

	add(device, switchOn) {		
		this.process.push({
			device : device,
			switchOn : switchOn
		});

		if (this.process.length == 1) {
			this._run();
		}
	},

	_run() {
		if (this.process.length < 1) {
			return;
		}

		const at 		= this.process[0];
		const status 	= at.switchOn ? 1 : 0;
		const device 	= at.device;
		const script	= `./radioEmission ${device} ${status}`;

		exec(script, (error, stdout, stderr) => {
			console.log(stdout);
			console.log(stderr);
			this.process.splice(0,1);
			this._run();
		});
	}
}

module.exports = ProcessController;