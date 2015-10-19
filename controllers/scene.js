exports.init = function(app){

	var Scene 		= require('./../models/scene');
	var Route 		= require('./../utils/route');
	var requestUtil = require('./../utils/requestUtil');

	app.route('/scene')

		.get(function (req,res){
			Scene.find({}, function onFind(err, supplies){
				if (err) {
					res.status(500).send(err);
				} else {
					res.send(supplies);
				}
			});
		})

		.post(function (req,res){
			if (req.body.devices === undefined || req.body.name === undefined) {
				res.sendStatus(400);	
			} else {
				var newScene = Scene({
					name: req.body.name,
					description: req.body.description,
					devices: req.body.devices
				});

				newScene.save(function onSave(err, group){
					if (err) {
						res.status(500).send(err);
					} else {
						res.send(group);
					}
				});
			}
		});

	app.route('/scene/:id_scene')

		.get(function (req,res){
			Scene.findById(req.params.id_scene, function onFind(err, scene){
				if (err) {
					res.status(500).send(err);
				} else if (scene === undefined) {
					res.sendStatus(404);
				} else {
					res.send(scene);
				}
			});
		})

		.put(function (req, res){
			Scene.findById(req.params.id_scene, function onFind(err, scene){
				if (err) {
					res.status(500).send(err);
				} else if (scene === undefined) {
					res.sendStatus(404);
				} else {
					if (req.body.name) {
						scene.name = req.body.name;
					}

					if (req.body.description) {
						scene.description = req.body.description;
					}

					if (req.body.devices) {
						scene.devices = req.body.devices;
					}

					scene.save(function onSave(err, scene){
						if (err) {
							res.status(500).send(err);
						} else {
							res.send(scene);
						}
					});
				}
			})
		})

		.delete(function (req, res){
			Scene.findById(req.params.id_scene, function onFind(err, scene){
				if (err) {
					res.status(500).send(err);
				} else if (scene === undefined) {
					res.sendStatus(404);
				} else {
					scene.remove(function onRemove(err){
						if (err) {
							res.status(500).send(err);
						} else {
							res.sendStatus(204);
						}
					});
				}
			});
		});

	app.route('/scene/:id_scene/action')

		.get(function (req, res){
			Scene.findById(req.params.id_scene, function onFind(err, scene){
				if (err) {
					res.status(500).send(err);
				} else if (scene === undefined) {
					res.sendStatus(404);
				} else {
					var params = app.get('config');
					makeHttpCalls(scene.devices, params);
					res.end();
				}
			});
		});

	function makeHttpCalls(devices, params){
		devices.forEach(function (device){
			var route = new Route(device.path, device.method, device.body)
				.setParams(params)
				.create();

			requestUtil(route);
		});
	}
}