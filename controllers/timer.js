exports.init = function(app) {

	const Timer 		= require('./../models/timer');
	const Route 		= require('./../utils/route');
	const requestUtil 	= require('./../utils/requestUtil');

	app.route('/timer')

		.get(function (req,res) {
			Timer.find({}, function onFind(err, supplies) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.send(supplies);
				}
			});
		})

		.post(function (req,res) {
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

		.get(function (req,res) {
			Timer.findById(req.params.id_timer, function onFind(err, timer) {
				if (err) {
					res.status(500).send(err);
				} else if (timer === undefined) {
					res.sendStatus(404);
				} else {
					res.send(timer);
				}
			});
		})

		.put(function (req, res) {
			Timer.findById(req.params.id_timer, function onFind(err, timer) {
				if (err) {
					res.status(500).send(err);
				} else if (timer === undefined) {
					res.sendStatus(404);
				} else {
					if (req.body.name) {
						timer.name = req.body.name;
					}

					if (req.body.description) {
						timer.description = req.body.description;
					}

					if (req.body.actions) {
						timer.actions = req.body.actions;
					}

					if (req.body.time) {
						timer.time = req.body.time;
					}

					timer.save(function onSave(err, timer) {
						if (err) {
							res.status(500).send(err);
						} else {
							res.send(timer);
						}
					});
				}
			})
		})

		.delete(function (req, res) {
			Timer.findById(req.params.id_timer, function onFind(err, timer) {
				if (err) {
					res.status(500).send(err);
				} else if (timer === undefined) {
					res.sendStatus(404);
				} else {
					timer.remove(function onRemove(err) {
						if (err) {
							res.status(500).send(err);
						} else {
							res.sendStatus(204);
						}
					});
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
		actions.forEach(action => {
			const route = new Route(action.path, action.method, action.body)
				.setParams(params)
				.create();

			requestUtil(route);
		});
	}
}