exports.exec = function(script, callback){
	var exec = require('child_process').exec;
	exec(script,function (error, stdout, stderr) {
		if(callback)  callback(error);
	});
}