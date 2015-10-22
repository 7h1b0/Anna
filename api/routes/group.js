exports.init = function (app) {

	const Group 		= require('./../models/group');
	const Url 		= require('./../helpers/urlHelper');
	const Request 		= require('./../services/requestService');

	app.route('/group')

		.get(function (req, res) {
			Group.find({}, function onFind(err, groups) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.send(groups);
				}
			});
		})

		.post(function (req, res) {
			const badRequest = req.body.paths === undefined || req.body.name === undefined;
			
			if (badRequest) {
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
				} else if (!group) {
					res.sendStatus(404);
				} else {
					res.send(group);
				}
			});
		})

		.put(function (req, res) {
			Group.findByIdAndUpdate(req.params.id_group, req.body, {new: true}, function onUpdate(err, group) {
				if (err) {
					res.status(500).send(err);
				} else if (!group) {
					res.sendStatus(404);
				} else {
					res.send(group);
				}
			})
		})

		.delete(function (req, res) {
			Group.findByIdAndRemove(req.params.id_group, function onRemove(err, group) {
				if (err) {
					res.status(500).send(err);
				} else if (!group) {
					res.sendStatus(404);
				} else {
					res.sendStatus(204);
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
		const hostname = 'hostname';
		const port = app.get('config').port;

		paths.forEach(path => {
			const resolvedPath = `${path}/${status}`;
			const url = Url.getUrl(hostname, port, resolvedPath);
			Request.get(url);
		});
	}
}