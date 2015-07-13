exports.exec = function(device_id, switchOn, callback){
	var exec = require('child_process').exec,
		script = "./radioEmission " + device_id + " " + switchOn;

	console.log(script);

	exec(script,function (error, stdout, stderr) {
		if(callback)  callback(error);
	});
}