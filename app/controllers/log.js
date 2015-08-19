exports.init = function(app){

	var fs 	= require('fs');

	app.use(function(req,res,next){
		if(app.get('config').log){
	 		fs.appendFile('./log.txt', getBuffer(req) , function(err){
				if(err){
					// ...	
				} 
			});
		}
		next();
	});

}

function getBuffer(req){
	return getDate() + " " + getTime() + " " + req.method + " " + req.hostname + req.originalUrl + " from " + req.ip + "\n";
}

function getDate(){
	var date 	= new Date();
	var month 	= date.getMonth()+ 1;

	return date.getDate() + "-" + month;
}

function getTime(){
	var date 	= new Date();
	return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
}