exports.init = function(app) {

	const Group 		= require('./../models/group');
	const Route 		= require('./../utils/route');
	const requestUtil 	= require('./../utils/requestUtil');

	app.route('/group')

		.get(function (req, res) {
			Group.find({}, function onFind(err, supplies) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.send(supplies);
				}
			});
		})

		.post(function (req, res) {
			if (req.body.paths === undefined || req.body.name === undefined) {
				res.sendStatus(400);	
			} else {
				const newGroup = Group({
					name: req.body.name,
					description: req.body.description,
					paths: req.body.paths
				});

				newGroup.save(function onSave(err, group) {
					if (err) {
						res.status(500).send(err);
					} else {
						res.send(group);
					}
				});
			}
		});

	app.route('/group/:id_group')

		.get(function (req, res) {
			Group.findById(req.params.id_group, function onFind(err, group) {
				if (err) {
					res.status(500).send(err);
				} else if (group === undefined) {
					res.sendStatus(404);
				} else {
					res.send(group);
				}
			});
		})

		.put(function (req, res) {
			Group.findById(req.params.id_group, function onFind(err, group) {
				if (err) {
					res.status(500).send(err);
				} else if (group === undefined) {
					res.sendStatus(404);
				} else {
					if (req.body.name) {
						group.name = req.body.name;
					}

					if (req.body.description) {
						group.description = req.body.description;
					}

					if (req.body.paths) {
						group.paths = req.body.paths;
					}

					group.save(function onSave(err, group) {
						if (err) {
							res.status(500).send(err);
						} else {
							res.send(group);
						}
					});
				}
			})
		})

		.delete(function (req, res) {
			Group.findById(req.params.id_group, function onFind(err, group) {
				if (err) {
					res.status(500).send(err);
				} else if (group === undefined) {
					res.sendStatus(404);
				} else {
					group.remove(function onRemove(err) {
						if (err) {
							res.status(500).send(err);
						} else {
							res.sendStatus(204);
						}
					});
				}
			});
		});

	app.route('/group/:id_group/:status(on|off)')

		.get(function (req, res) {
			Group.findById(req.params.id_group, function onFind(err, group) {
				if (err) {
					res.status(500).send(err);
				} else if (group === undefined) {
					res.sendStatus(404);
				} else {
					const params = app.get('config');
					const status = req.params.status;
					makeHttpCalls(group.paths, status, params);
					res.end();
				}
			});
		});

	function makeHttpCalls(paths, status, params) {
		paths.forEach(path => {
			const resolvedPath = `${path}/${status}`;
			const route = new Route(resolvedPath, 'GET').setParams(params).create();
			requestUtil(route);
		});
	}
}