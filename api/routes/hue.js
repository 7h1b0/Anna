'use strict';

module.exports = function (router, config) {

	const HueService = require('./../services/hueService');
	const hueService = new HueService(config.hostname, config.username, config.port);

	router.route('/api/hue/light')
		.get(function (req, res) {
			hueService.getLights().then(lights => {
				res.send(lights);
			}).catch(err => {
				res.status(500).send(err);
			});
		})

	router.route('/api/hue/light/:id_light([0-9]{1,2})')
		.get(function (req, res) {
			hueService.getLight(req.params.id_light).then(light => {
				res.send(light);
			}).catch(err => {
				res.status(500).send(err);
			});
		})

		.put(function (req, res) {
			if (req.body.name === undefined) {
				res.sendStatus(400);
			} else {
				hueService.renameLight(req.params.id_light, req.body.name).then(result => {
					res.send(result);
				}).catch(err => {
					res.status(500).send(err);
				});
			}	
		})

	router.route('/api/hue/light/:id_light([0-9]{1,2})/state')
		.put(function (req, res) {
			let state = {};

			const hasBody = req.body && Object.keys(req.body).length > 0;
			if (hasBody) {
				state = req.body;
			} else {
				const bri = req.query.bri;
				if (!isNaN(bri)) {
					state.bri = parseInt(bri);
				}

				const sat = req.query.sat;
				if (!isNaN(sat)) {
					state.sat = parseInt(sat);
				}

				const xy = req.query.xy;
				if (Array.isArray(xy)) {
					state.xy = xy.map(item => {
						return parseFloat(item);
					});
				}
			}

			if (Object.keys(state).length > 0) {
				hueService.setLightState(req.params.id_light, state).then(result => {
					res.send(result);
				}).catch(err => {
					res.status(500).send(err);
				});
			} else {
				res.sendStatus(400);
			}
		});

	router.route('/api/hue/light/:id_light([0-9]{1,2})/:status(on|off)')
		.get(function (req, res) {
			hueService.switchLight(req.params.id_light, req.params.status === 'on').then(result => {
				res.send(result);
			}).catch(err => {
				res.status(500).send(err);
			});
		});
}