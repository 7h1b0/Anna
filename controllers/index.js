exports.init = function(app){
	app.route('/').get(function(req,res,next){	
		res.status(200).end('OK');	
	});
}