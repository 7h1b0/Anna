exports.init = function (app){

	var processManager 		= require('./../managers/processManager');
	var DioGroup 			= require('./../models/dioGroup')
	var process 			= new processManager();

	app.route('/dio/group')

		.get(function (req,res){
			DioGroup.find({}, function (err, dioGroups){
				if (err) {
					res.status(500).send(err);
				} else {
					res.send(dioGroups);
				}
			});
		})

		.post(function (req,res){
			if (req.body.supplies === undefined || req.body.name === undefined) {
				res.sendStatus(400);	
			} else {
				var newDioGroup = DioGroup({
					supplies: req.body.supplies,
					name: req.body.name,
					description: req.body.description
				});

				newDioGroup.save(function (err, dioGroup){
					if (err) {
						res.status(500).send(err);
					} else {
						res.send(dioGroup);
					}
				});
			}
		});

	app.route('/dio/group/:id_group')

		.get(function (req,res){
			DioGroup.findById(req.params.id_group, function (err, dioGroup){
				if (err) {
					res.status(500).send(err);
				} else if (dioGroup === undefined) {
					res.sendStatus(404);
				} else {
					res.send(dioGroup);
				}
			});
		})

		.put(function(req,res){
			if (req.body.name === undefined) {
				res.sendStatus(400);
			} else {
				DioGroup.findById(req.params.id_group, function (err, dioGroup){
					if (err) {
						res.status(500).send(err);
					} else if (dioGroup === undefined) {
						res.sendStatus(404);
					} else {
						dioGroup.name = req.body.name;
						dioGroup.description = req.body.description;
						dioGroup.save(function (err){
							if (err) {
								res.status(500).send(err);
							} else {
								res.send(dioGroup);
							}
						});
					}
				});		
			}			
		})

		.delete(function (req, res){
			DioGroup.findById(req.params.id_group, function (err, dioGroup){
				if (err) {
					res.status(500).send(err);
				} else if (dioGroup === undefined) {
					res.sendStatus(404);
				} else {
					dioGroup.remove(function (err){
						if (err) {
							res.status(500).send(err);
						} else {
							res.sendStatus(204);
						}
					});
				}
			});
		});


	app.route('/dio/group/:id_group/:status(on|off)')

		.get(function (req,res){
			DioGroup.findById(req.params.id_group, function (err, dioGroup){
				if (err) {
					res.status(500).send(err);
				} else if (dioGroup === undefined) {
					res.sendStatus(404);
				} else {
					process.addArray(dioGroup.supplies, req.params.status === 'on');
					res.end();
				}
			});
		});

}