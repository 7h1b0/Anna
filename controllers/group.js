exports.init = function(app){

	var Group 		= require('./../models/group');
	var Route 		= require('./../utils/route');
	var requestUtil = require('./../utils/requestUtil');

	app.route('/group')

		.get(function (req, res){
			Group.find({}, function (err, supplies){
				if (err) {
					res.status(500).send(err);
				} else {
					res.send(supplies);
				}
			});
		})

		.post(function (req, res){
			if (req.body.devices === undefined || req.body.name === undefined) {
				res.sendStatus(400);	
			} else {
				var newGroup = Group({
					name: req.body.name,
					description: req.body.description,
					devices: req.body.devices
				});

				newGroup.save(function (err, group){
					if (err) {
						res.status(500).send(err);
					} else {
						res.send(group);
					}
				});
			}
		});

	app.route('/group/:id_group')

		.get(function (req, res){
			Group.findById(req.params.id_group, function (err, group){
				if (err) {
					res.status(500).send(err);
				} else if (group === undefined) {
					res.sendStatus(404);
				} else {
					res.send(group);
				}
			});
		})

		.put(function (req, res){
			Group.findById(req.params.id_group, function (err, group){
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

					if (req.body.devices) {
						group.devices = req.body.devices;
					}

					group.save(function (err, group){
						if (err) {
							res.status(500).send(err);
						} else {
							res.send(group);
						}
					});
				}
			})
		})

		.delete(function (req, res){
			Group.findById(req.params.id_group, function (err, group){
				if (err) {
					res.status(500).send(err);
				} else if (group === undefined) {
					res.sendStatus(404);
				} else {
					group.remove(function (err){
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

		.get(function (req, res){
			Group.findById(req.params.id_group, function (err, group){
				if (err) {
					res.status(500).send(err);
				} else if (group === undefined) {
					res.sendStatus(404);
				} else {
					group.devices.forEach(function (path){
						var path = path + "/" + req.params.status;
						var url = requestUtil.getUrl(app, path);
						var route = new Route(url, "GET");
						requestUtil.request(route, () => {});
					});
					res.end();
				}
			});
		});
}