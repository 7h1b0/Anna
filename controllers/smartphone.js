var exec = require('child_process').exec,
	config = require(__dirname + '/../config/config.json');

exports.check = function(){
	var check = 0;
	setInterval(function(){	
		exec('ping '+ config.ping +' -w 1',function(error, stdout, stderr){
		    if (error !== null) {
		    	check ++;
				if(check == 2){
					exec('out.sh');
					check = 0;
				}
				
		    }else{    	
		    	check = 0;
		    }
		});
	},1000*60*20); 
}