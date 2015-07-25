var cronManager = require('./../managers/cronManager');

exports.init = function(app){
	var manager = new cronManager();

	app.route('/schedule')

		.get(function(req,res){
			res.send(manager.getAll());
		})

		.post(function(req,res){
			if(jsonIsValid(req)){
				if(manager.exists(req.body.title)){
					res.status(409).end();
				}else{
					manager.add(req.body.title, req.body.timestamp, req.body.device_id, req.body.switchOn);
					manager.start(req.body.title);
					res.status(201).end();
				}
			}else{
				res.status(400).json({response : 'Error'});
			}
		})


	app.route('/schedule/:id')

		.get(function(req,res){
			res.send(manager.get(req.params.id));
		})	

		.delete(function(req,res){
			if(manager.exists(req.params.id)){
				manager.delete(req.params.id);
				res.status(204).end();
			}else{
				res.status(404).end();
			}	
		})
		

	app.route('/schedule/:status(start|stop)/:id')	
		.get(function(req,res){
			if(manager.exists(req.params.id)){
				if(req.params.status === 'start'){
					manager.start(req.params.id);
				}else{
					manager.stop(req.params.id);
				}

				res.status(204).end();
			}else{
				res.status(404).end();
			}
		})

}

function jsonIsValid(req){
	if(req.body.title === undefined || typeof req.body.title !== 'string'){
		return false;
	}else if(req.body.timestamp === undefined){
		return false;
	}else if(req.body.device_id === undefined || req.body.device_id > 99 || req.body.device_id < 0){
		return false;
	}else if(req.body.switchOn === undefined ){
		return false;
	}else{
		return true;
	}
}