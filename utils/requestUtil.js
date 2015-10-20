const request = require('request');

module.exports = function(route, cb) {	
	request(route, function(err, res, body) {
		if (body) {
			try {
				body = JSON.parse(body);
			} catch (ignored) {} // Body is already a valid JSON
		}
		
		if (Array.isArray(body) && body[0].error) {
			err = body[0].error;
		}
		
		if (cb !== undefined){
			cb(err,res,body);
		}
    });
}