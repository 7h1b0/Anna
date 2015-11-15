module.exports = function (router, config) {

	const Scene 				= require('./../models/scene');
	const makeLocalRequest = require('./../helpers/makeLocalRequestHelper');

	router.route('/api/scene')
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
			const badRequest = req.body.actions === undefined || req.body.name === undefined;

			if (badRequest) {
				res.sendStatus(400);	
			} else {
				const newScene = Scene({
					name: req.body.name,
					description: req.body.description,
					actions: req.body.actions
				});

				newScene.save(function onSave(err, scene) {
					if (err) {
						res.status(500).send(err);
					} else {
						res.send(scene);
					}
				});
			}
		});

	router.route('/api/scene/:id_scene([0-9a-z]{24})')
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

	router.route('/api/scene/:id_scene([0-9a-z]{24})/action')
		.get(function (req, res) {
			Scene.findById(req.params.id_scene, function onFind(err, scene) {
				if (err) {
					res.status(500).send(err);
				} else if (!scene) {
					res.sendStatus(404);
				} else {
					makeLocalRequest(scene.actions, config.port, req.headers['x-access-token']).then(() => {
						res.end();
					}, err => {
						res.status(500).send(err);
					});
				}
			});
		});
}