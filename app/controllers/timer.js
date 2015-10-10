exports.init = function(app){

	var Timer 		= require('./../model/timer');
	var Route 		= require('./../utils/route');
	var requestUtil = require('./../utils/requestUtil');

	app.route('/timer')

		.get(function (req,res){
			Timer.find({}, function (err, supplies){
				if (err) {
					res.status(500).send(err);
				} else {
					res.send(supplies);
				}
			});
		})

		.post(function (req,res){
			if (req.body.actions === undefined || req.body.name === undefined || req.body.time === undefined) {
				res.sendStatus(400);	
			} else {
				var newTimer = Timer({
					name: req.body.name,
					description: req.body.description,
					time: req.body.time,
					actions: req.body.actions
				});

				newTimer.save(function (err, timer){
					if (err) {
						res.status(500).send(err);
					} else {
						res.send(timer);
					}
				});
			}
		});

	app.route('/timer/:id_timer')

		.get(function (req,res){
			Timer.findById(req.params.id_timer, function (err, timer){
				if (err) {
					res.status(500).send(err);
				} else if (timer === undefined) {
					res.sendStatus(404);
				} else {
					res.send(timer);
				}
			});
		})

		.put(function (req, res){
			Timer.findById(req.params.id_timer, function (err, timer){
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

					timer.save(function (err, timer){
						if (err) {
							res.status(500).send(err);
						} else {
							res.send(timer);
						}
					});
				}
			})
		})

		.delete(function (req, res){
			Timer.findById(req.params.id_timer, function (err, timer){
				if (err) {
					res.status(500).send(err);
				} else if (timer === undefined) {
					res.sendStatus(404);
				} else {
					timer.remove(function (err){
						if (err) {
							res.status(500).send(err);
						} else {
							res.sendStatus(204);
						}
					});
				}
			});
		});

	app.route('/timer/:id_timer/on')

		.get(function (req, res){
			Timer.findById(req.params.id_timer, function (err, timer){
				if (err) {
					res.status(500).send(err);
				} else if (timer === undefined) {
					res.sendStatus(404);
				} else {
					setTimeout(doActions, timer.time, timer.actions);
					res.send();
				}
			});
		});

	function getUrl(path){
		var port = app.get('config').port;
		return "http://localhost:" + port + path;
	}

	function doActions(actions){
		console.log(actions);
		actions.forEach(function (action){
			var url = getUrl(action.path);
			var route = new Route(url, action.method, action.body);
			requestUtil(route, () => {});
		});
	}
}