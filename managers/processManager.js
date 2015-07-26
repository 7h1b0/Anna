exports.exec = function(device_id, switchOn, callback){
	var exec = require('child_process').exec,
		status = switchOn ? 1 : 0
		script = "./radioEmission " + device_id + " " + status;
		console.log(script);

	exec(script,function (error, stdout, stderr) {
		if(callback)  callback(error);
	});
}