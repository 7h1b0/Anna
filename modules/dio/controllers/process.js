var exec = require('child_process').exec;

function ProcessController(){
	this.process = [];
}

ProcessController.prototype = {

	add: function (device, switchOn){		
		this.process.push({
			device : device,
			switchOn : switchOn
		});

		if (this.process.length == 1) {
			this._run();
		}
	},

	_run: function (){
		if (this.process.length < 1) {
			return;
		}

		var at 		= this.process[0];
		var status 	= at.switchOn ? 1 : 0;
		var script 	= "./radioEmission " + at.device + " " + status;

		exec(script, (error, stdout, stderr) => {
			// console.log(stdout);
			// console.log(stderr);
			this.process.splice(0,1);
			this._run();
		});
	}
}

module.exports = ProcessController;