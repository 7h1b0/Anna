var exec 	= require('child_process').exec;

function ProcessManager(){}

ProcessManager.prototype = {
	process: [],
	delta: 1000,

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
		var length = devices.length;
		for(var i=0; i< length; i++){
			this.process.push({
				device : devices[i],
				switchOn : switchOn
			});
		}

		if (this.process.length == length) {
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
		var that 	= this;


		exec(script,function (error, stdout, stderr) {
			console.log(stdout);
			console.log(stderr);
		});

		this.process.splice(0,1);

		if (this.process.length > 0) {
			setTimeout(function (){
				that.run();
			}, this.delta);
		}
	}
}

module.exports = ProcessManager;