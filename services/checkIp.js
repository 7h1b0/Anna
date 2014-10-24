var exec = require('child_process').exec;

exports.run = function(ip){
	var i = 0,
		check = true,
		date;

	setInterval(function(){	
		date = new Date();
		if(date.getHours() > 20 && check){
			exec('ping '+ ip +' -w 1',function(error, stdout, stderr){
			    if (error !== null) {
			    	i ++;
					if(i == 2){
						exec('out.sh');
						i = 0;
						check = false;
					}
					
			    }else{    	
			    	i = 0;
			    }
			});
		}else if(date.getHours() < 20){
			check = true;
		}	
	},1000*90); // Every 1.30 minutes
}