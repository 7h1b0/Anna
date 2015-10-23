exports.init = function (app) {

	const Timer 		= require('./../models/timer');
	const Url 			= require('./../helpers/urlHelper');
	const request 	= require('./../services/requestService');

	app.route('/timer')
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

	app.route('/timer/:id_timer')
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

	app.route('/timer/:id_timer/action')
		.get(function (req, res) {
			Timer.findById(req.params.id_timer, function onFind(err, timer) {
				if (err) {
					res.status(500).send(err);
				} else if (timer === undefined) {
					res.sendStatus(404);
				} else {
					const params = app.get('config');
					setTimeout(makeHttpCalls, timer.time, timer.actions, params);
					res.send();
				}
			});
		});

	function makeHttpCalls(actions, params){
		const hostname = 'hostname';
		const port = app.get('config').port;

		actions.forEach(action => {
			const url = Url.getUrl(hostname, port, action.path);
			Request.get(url);
		});
	}
}