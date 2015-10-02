exports.init = function (app, api){

	app.route('/hue/group')

		.get(function (req,res){
			api.getGroups(function (err, result, body) {
			    if (err) {
			    	res.status(404).send(err);
			    } else {
			    	res.send(body);
			    }
			});
		})

		.post(function (req,res){
			if (req.body.name === undefined || req.body.lights == undefined) {
				res.sendStatus(400);
			} else {
				api.addGroup(req.body, function (err, result, body){
					if (err) {
						res.status(404).send(err);
					}else {
						res.send(body);
					}
				})
			}
		})

	app.route('/hue/group/:id_group([0-9]{1,2})')

		.get(function (req,res){
			api.getGroup(req.params.id_group, function (err, result, body){
			    if (err) {
			    	res.status(404).send(err);
			    } else {
			    	res.send(body);
			    }
			});
		})

		.put(function (req,res){
			if (req.body.name === undefined && req.body.lights == undefined) {
				res.sendStatus(400);
			} else {
				api.setGroup(req.params.id_group, req.body, function (err, result, body) {
				    if (err) {
				    	res.status(404).send(err);
				    } else {
				    	res.sendStatus(204);
				    }
				});
			}	
		})

		.delete(function (req,res){
			api.deleteGroup(req.params.id_group, function (err, result, body){
			    if (err) {
			    	res.status(404).send(err);
			    } else {
			    	res.end();
			    }
			});
		})

	app.route('/hue/group/:id_group([0-9]{1,2})/state')

		.put(function (req,res){
			api.setGroupState(req.params.id_group, req.body, function (err, result, body) {
			    if (err) {
			    	res.status(404).send(err);
			   	} else {
			   		res.sendStatus(204);
			   	}
			});
		})

	app.route('/hue/group/:id_group([0-9]{1,2})/:status(on|off)')

		.get(function (req,res){
			api.switchGroupOn(req.params.id_group, req.params.status === 'on', function (err, result, body) {
			    if (err) {
			    	res.status(404).send(err);
			   	} else {
			   		res.end();
			   	}
			});
		});
}