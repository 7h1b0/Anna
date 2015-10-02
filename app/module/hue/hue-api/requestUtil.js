var request = require('request');

module.exports =  function(route, cb){	
	request(route, function(err, res, body){
		body = JSON.parse(body);

		if(Array.isArray(body) && body[0].error) err = body[0].error;
		
    	cb(err,res,body);
    });
}