exports.init = function (app, api){

	app.route('/hue/light')

		.get(function (req,res){
			api.getLights(function (err, result, body){
				if (err) {
					res.status(404).send(err);
				} else {
					res.send(body);
				}
			});
		})

	app.route('/hue/light/:id_light([0-9]{1,2})')

		.get(function (req,res){
			api.getLight(req.params.id_light, function (err, result, body){
				if (err) {
					res.status(404).send(err);
				} else {
					res.send(body);
				}
			});
		})

		.put(function (req,res){
			if (req.body.name === undefined) {
				res.sendStatus(400);
			} else {
				api.renameLight(req.params.id_light, req.body, function (err, result, body) {
				    if (err) {
				    	res.status(404).send(err);
				    } else {
				    	res.sendStatus(204);
				    }
				});
			}	
		})

	app.route('/hue/light/:id_light([0-9]{1,2})/state')

		.put(function (req,res){
			api.setLightState(req.params.id_light, req.body, function (err, result, body) {
			    if (err) {
			    	res.status(404).send(err);
			   	} else {
			   		res.sendStatus(204);
			   	}
			});
		});

	app.route('/hue/light/:id_light([0-9]{1,2})/:status(on|off)')

		.get(function (req,res){
			api.switchLight(req.params.id_light, req.params.status === 'on', function (err, result, body) {
			    if (err) {
			    	res.status(404).send(err);
			   	} else {
			   		res.send(body);
			   	}
			});
		});
}