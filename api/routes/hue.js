module.exports = function (router, config) {

	const HueService = require('./../services/hueService');
	const hueService = new HueService(config.hostname, config.username, config.port);

	router.route('/api/hue/light')
		.get(function (req, res) {
			hueService.getLights().then(function onResponse(lights) {
				res.send(lights);
			}).catch(function (err) {
				res.status(500).send(err);
			});
		})

	router.route('/api/hue/light/:id_light([0-9]{1,2})')
		.get(function (req, res) {
			hueService.getLight(req.params.id_light).then(function onResponse(light) {
				res.send(light);
			}).catch(function (err) {
				res.status(500).send(err);
			});
		})

		.put(function (req, res) {
			if (req.body.name === undefined) {
				res.sendStatus(400);
			} else {
				hueService.renameLight(req.params.id_light, req.body.name).then(function onResponse(result) {
					res.send(result);
				}).catch(function (err) {
					res.status(500).send(err);
				});
			}	
		})

	router.route('/api/hue/light/:id_light([0-9]{1,2})/state')
		.put(function (req, res) {
			hueService.setLightState(req.params.id_light, req.body).then(function onResponse(result) {
				res.send(result);
			}).catch(function (err) {
				res.status(500).send(err);
			});
		});

	router.route('/api/hue/light/:id_light([0-9]{1,2})/:status(on|off)')
		.get(function (req, res) {
			hueService.switchLight(req.params.id_light, req.params.status === 'on').then(function onResponse(result) {
				res.send(result);
			}).catch(function (err) {
				res.status(500).send(err);
			});
		});
}