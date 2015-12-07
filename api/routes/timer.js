module.exports = function (router, config) {

	const Timer 				= require('./../models/timer');
	const makeLocalRequest = require('./../helpers/makeLocalRequestHelper');

	router.route('/api/timer')
		.get((req, res) => {
			Timer.find({})
				.then(timers => res.send(timers))
				.catch(err => res.status(500).send(err));
		})

		.post((req, res) => {
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

				newTimer.save()
					.then(timer => res.status(201).send(timer))
					.catch(err => res.status(500).send(err));
			}
		});

	router.route('/api/timer/:id_timer([0-9a-z]{24})')
		.get((req, res) => {
			Timer.findById(req.params.id_timer)
				.then(timer => {
					if (!timer) {
						res.sendStatus(404);
					} else {
						res.send(timer);
					}
				})
				.catch(err => res.status(500).send(err));
		})

		.put((req, res) => {
			Timer.findByIdAndUpdate(req.params.id_timer, req.body, {new: true})
				.then(timer => {
					if (!timer) {
						res.sendStatus(404);
					} else {
						res.send(timer);
					}
				})
				.catch(err => res.status(500).send(err));
		})

		.delete((req, res) => {
			Timer.findByIdAndRemove(req.params.id_timer)
				.then(timer => {
					if (!timer) {
						res.sendStatus(404);
					} else {
						res.sendStatus(204);
					}
				})
				.catch(err => res.status(500).send(err));
		});

	router.route('/api/timer/:id_timer([0-9a-z]{24})/action')
		.get((req, res) => {
			Timer.findById(req.params.id_timer)
				.then(timer => {
					if (timer === undefined) {
						res.sendStatus(404);
					} else {
						const port = config.port;
						const token = req.headers['x-access-token'];

						makeLocalRequest(timer.actions.before, port, token);
						
						const milliseconds = timer.time * 60 * 1000;
						setTimeout(makeLocalRequest, milliseconds, timer.actions.after, port, token);
						
						res.send();
					}
				})
				.catch(err => res.status(500).send(err));
		});
}