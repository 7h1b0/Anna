exports.init = function (app, api){

	app.route('/hue/scene')

		.get(function (req,res){
			api.getScenes(function (err, result, body) {
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
				api.addScene(req.body.name, req.body.lights, function (err, result){
					if (err) {
						res.status(404).send(err);
					} else {
						res.send(result.id);
					}
				});
			}
		})

	app.route('/hue/scene/:id_scene([0-9a-zA-Z_-]{1,})')

		.put(function (req,res){
			if (req.body.name === undefined || req.body.lights == undefined) {
				res.sendStatus(400);
			} else {
				api.setScene(req.params.id_scene, req.body, function (err, result) {
				    if (err) {
				    	res.status(404).send(err);
				    } else {
				    	res.sendStatus(204);
				    }
				});
			}	
		})

	app.route('/hue/scene/:id_scene([0-9a-zA-Z_-]{1,})/:id_light([0-9]{1,2})')

		.put(function (req, res){
			api.setSceneState(req.params.id_scene, req.params.id_light, req.body, function (err, result, body){
			    if (err) {
			    	res.status(404).send(err);
			    } else {
			    	res.sendStatus(204);
			    }
			});
		})

	app.route('/hue/scene/:id_scene([0-9a-zA-Z_-]{1,})/:status(on|off)')

		.get(function (req,res){
			api.switchScene(req.params.id_scene, req.params.status === 'on', function (err, result, body){
				if (err) {
					res.status(404).send(err);
				} else {
					res.end();
				}
			});
		});
}