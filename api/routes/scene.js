module.exports = function (router, config) {

	const Scene 				= require('./../models/scene');
	const makeLocalRequest = require('./../helpers/makeLocalRequestHelper');

	router.route('/api/scene')
		.get((req, res) => {
			Scene.find({})
				.then(scenes => res.send(scenes))
				.catch(err => res.status(500).send(err));
		})

		.post((req, res) => {
			const badRequest = req.body.actions === undefined || req.body.name === undefined;

			if (badRequest) {
				res.sendStatus(400);	
			} else {
				const newScene = Scene({
					name: req.body.name,
					description: req.body.description,
					actions: req.body.actions
				});

				newScene.save()
					.then(scene => res.status(201).send(scene))
					.catch(err => res.status(500).send(err));
			}
		});

	router.route('/api/scene/:id_scene([0-9a-z]{24})')
		.get((req, res) => {
			Scene.findById(req.params.id_scene).then(scene => {
				if (!scene) {
					res.sendStatus(404);
				} else {
					res.send(scene);
				}
			}).catch(err => res.status(500).send(err));
		})

		.put((req, res) => {
			Scene.findByIdAndUpdate(req.params.id_scene, req.body, {new: true}).then(scene => {
				if (!scene) {
					res.sendStatus(404);
				} else {
					res.send(scene);
				}
			}).catch(err => res.status(500).send(err));
		})

		.delete((req, res) => {
			Scene.findByIdAndRemove(req.params.id_scene).then(scene => {
				if (!scene) {
					res.sendStatus(404);
				} else {
					res.sendStatus(204);
				}
			}).catch(err => res.status(500).send(err));
		});

	router.route('/api/scene/:id_scene([0-9a-z]{24})/action')
		.get((req, res) => {
			Scene.findById(req.params.id_scene).then(scene => {
				if (!scene) {
					res.sendStatus(404);
				} else {
					makeLocalRequest(scene.actions, config.port, req.headers['x-access-token'])
						.then(() => res.end())
						.catch(err => res.status(500).send(err));
				}
			}).catch(err => res.status(500).send(err));
		});
}