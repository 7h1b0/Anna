module.exports = function (router, config) {

	const Timer 				= require('./../models/timer');
	const makeLocalRequest = require('./../helpers/makeLocalRequestHelper');

	router.route('/api/timer')
		.get(function (req, res) {
			Timer.find({}, function onFind(err, timers) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.send(timers);
				}
			});
		})

		.post(function (req, res) {
			const badRequest = req.body.actions === undefined || req.body.name === undefined || req.body.time === undefined;
			
			if (badRequest) {
				res.sendStatus(400);	
			} else {
				const newTimer = Timer({
					name: req.body.name,
					description: req.body.description,
					time: req.body.time,
					actions: req.body.actions
				});

				newTimer.save(function onSave(err, timer) {
					if (err) {
						res.status(500).send(err);
					} else {
						res.send(timer);
					}
				});
			}
		});

	router.route('/api/timer/:id_timer([0-9a-z]{24})')
		.get(function (req, res) {
			Timer.findById(req.params.id_timer, function onFind(err, timer) {
				if (err) {
					res.status(500).send(err);
				} else if (!timer) {
					res.sendStatus(404);
				} else {
					res.send(timer);
				}
			});
		})

		.put(function (req, res) {
			Timer.findByIdAndUpdate(req.params.id_timer, req.body, {new: true}, function onUpdate(err, timer) {
				if (err) {
					res.status(500).send(err);
				} else if (!timer) {
					res.sendStatus(404);
				} else {
					res.send(timer);
				}
			})
		})

		.delete(function (req, res) {
			Timer.findByIdAndRemove(req.params.id_timer, function onRemove(err, timer) {
				if (err) {
					res.status(500).send(err);
				} else if (!timer) {
					res.sendStatus(404);
				} else {
					res.sendStatus(204);
				}
			});
		});

	router.route('/api/timer/:id_timer([0-9a-z]{24})/action')
		.get(function (req, res) {
			Timer.findById(req.params.id_timer, function onFind(err, timer) {
				if (err) {
					res.status(500).send(err);
				} else if (timer === undefined) {
					res.sendStatus(404);
				} else {
					const port = config.port;
					const token = req.headers['x-access-token'];

					makeLocalRequest(scene.actions.before, port, token);
					setTimeout(makeLocalRequest, timer.time, timer.actions.after, port, token);
					
					res.send();
				}
			});
		});
}