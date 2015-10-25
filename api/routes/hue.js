exports.init = function (app) {

	const config = app.get('config').hue;
	const HueService = require('./../services/hueService')(config.hostname, config.username, config.port)

	app.route('/hue/light')
		.get(function (req, res) {
			HueService.getLights().then(function onResponse(lights) {
				res.send(lights);
			}).catch(function (err) {
				res.status(500).send(err);
			});
		})

	app.route('/hue/light/:id_light([0-9]{1,2})')

		.get(function (req, res) {
			HueService.getLight(req.params.id_light).then(function onResponse(light) {
				res.send(light);
			}).catch(function (err) {
				res.status(500).send(err);
			});
		})

		.put(function (req, res) {
			if (req.body.name === undefined) {
				res.sendStatus(400);
			} else {
				HueService.renameLight(req.params.id_light, req.body.name).then(function onResponse(result) {
					res.send(result);
				}).catch(function (err) {
					res.status(500).send(err);
				});
			}	
		})

	app.route('/hue/light/:id_light([0-9]{1,2})/state')

		.put(function (req,res){
			HueService.setLightState(req.params.id_light, req.body).then(function onResponse(result) {
				res.send(result);
			}).catch(function (err) {
				res.status(500).send(err);
			});
		});

	app.route('/hue/light/:id_light([0-9]{1,2})/:status(on|off)')

		.get(function (req,res){
			HueService.switchLight(req.params.id_light, req.params.status === 'on').then(function onResponse(result) {
				res.send(result);
			}).catch(function (err) {
				res.status(500).send(err);
			});
		});
}