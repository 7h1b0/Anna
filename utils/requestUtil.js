var request = require('request');

module.exports =  {

	request: function(route, cb){	
		request(route, function(err, res, body){
			if (body) {
				try {
					body = JSON.parse(body);
				} catch (ignored) {} // Body is already a valid JSON
			}
			
			if (Array.isArray(body) && body[0].error) {
				err = body[0].error;
			}
			
	    	cb(err,res,body);
	    });
	},

	getUrl: function(app, path){
		var config = app.get('config');
		var port = config.port;
		var protocol = config.http ? 'http://' : 'https://';
		return protocol + "localhost:" + port + path;
	}
}