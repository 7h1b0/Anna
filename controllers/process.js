exports.exec = function(script){
	var exec = require('child_process').exec;
	exec(script,function (error, stdout, stderr) {
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	});
}