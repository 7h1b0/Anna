exports.init = function (app) {

	const Scene 		= require('./../models/scene');
	const Route 		= require('./../models/route');
	const request 	 	= require('./../services/requestService');

	app.route('/scene')

		.get(function (req, res) {
			Scene.find({}, function onFind(err, scenes) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.send(scenes);
				}
			});
		})

		.post(function (req, res) {
			const badRequest = req.body.devices === undefined || req.body.name === undefined;

			if (badRequest) {
				res.sendStatus(400);	
			} else {
				const newScene = Scene({
					name: req.body.name,
					description: req.body.description,
					devices: req.body.devices
				});

				newScene.save(function onSave(err, scenes) {
					if (err) {
						res.status(500).send(err);
					} else {
						res.send(scenes);
					}
				});
			}
		});

	app.route('/scene/:id_scene')

		.get(function (req, res) {
			Scene.findById(req.params.id_scene, function onFind(err, scene) {
				if (err) {
					res.status(500).send(err);
				} else if (!scene) {
					res.sendStatus(404);
				} else {
					res.send(scene);
				}
			});
		})

		.put(function (req, res) {
			Scene.findByIdAndUpdate(req.params.id_scene, req.body, {new: true}, function onUpdate(err, scene) {
				if (err) {
					res.status(500).send(err);
				} else if (!scene) {
					res.sendStatus(404);
				} else {
					res.send(scene);
				}
			});
		})

		.delete(function (req, res) {
			Scene.findByIdAndRemove(req.params.id_scene, function onRemove(err, scene) {
				if (err) {
					res.status(500).send(err);
				} else if (!scene) {
					res.sendStatus(404);
				} else {
					res.sendStatus(204);
				}
			});
		});

	app.route('/scene/:id_scene/action')

		.get(function (req, res) {
			Scene.findById(req.params.id_scene, function onFind(err, scene) {
				if (err) {
					res.status(500).send(err);
				} else if (scene === undefined) {
					res.sendStatus(404);
				} else {
					const params = app.get('config');
					makeHttpCalls(scene.devices, params);
					res.end();
				}
			});
		});

	function makeHttpCalls(devices, params) {
		devices.forEach(device => {
			const route = new Route(device.path, device.method, device.body)
				.setParams(params)
				.create();

			request(route);
		});
	}
}