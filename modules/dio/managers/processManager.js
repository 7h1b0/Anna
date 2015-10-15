var exec 	= require('child_process').exec;
const delta = 1000;

function ProcessManager(){}

ProcessManager.prototype = {
	process: [],

	add: function (device, switchOn){
		this.process.push({
			device : device,
			switchOn : switchOn
		});

		if (this.process.length == 1) {
			this.run();
		}
	},

	addArray: function (devices, switchOn){
		devices.forEach((device) => {
			this.process.push({
				device: device,
				switchOn: switchOn
			});
		});

		if (this.process.length == devices.length) {
			this.run();
		}
	},

	run: function (){
		if (this.process.length < 1) {
			return;
		}

		var at 		= this.process[0];
		var status 	= at.switchOn ? 1: 0;
		var script 	= "./radioEmission " + at.device + " " + status;

		exec(script,function (error, stdout, stderr) {
			/*console.log(stdout);
			console.log(stderr);*/
		});

		if (this.process.length > 0) {
			setTimeout(() => {
				this.process.splice(0,1);
				this.run();
			}, delta);
		}
	}
}

module.exports = ProcessManager;