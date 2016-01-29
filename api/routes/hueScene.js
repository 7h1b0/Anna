'use strict';

module.exports = (router, hueService) => {

	router.route('/api/hue/scenes')
		.get((req, res) => {
			hueService.getScenes()
				.then(scenes => res.send(scenes))
				.catch(err => res.status(500).send(err));
		})

	router.route('/api/hue/scenes/:id_scene')
		.get((req, res) => {
			hueService.getScene(req.params.id_scene)
				.then(light => res.send(light))
				.catch(err => res.status(500).send(err));
		});
}