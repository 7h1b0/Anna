exports.init = function (app) {

	const processService 	= require('./../services/processService');
	const Dio 				= require('./../models/dio.js');
	const process 			= new processService();

	app.route('/dio')

		.get(function (req,res) {
			Dio.find({}, function onFind(err, dios) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.send(dios);
				}
			});
		})

		.post(function (req,res) {
			const badRequest = req.body.id_dio === undefined || req.body.name === undefined;
			
			if (badRequest) {
				res.sendStatus(400);	
			} else {
				const newDio = Dio({
					id_dio: req.body.id_dio,
					name: req.body.name
				});

				newDio.save(function onSave(err, dio) {
					if (err) {
						res.status(500).send(err);
					} else {
						res.send(dio);
					}
				});
			}
		});

	app.route('/dio/:id_dio([0-9]{1,2})')

		.get(function (req,res) {
			Dio.findOne({id_dio: req.params.id_dio}, function onFind(err, dio) {
				if (err) {
					res.status(500).send(err);
				} else if (!dio) {
					res.sendStatus(404);
				} else {
					res.send(dio);
				}
			});
		})

		.put(function (req,res) {
			if (req.body.name === undefined) {
				res.sendStatus(400);
			} else {
				Dio.findOneAndUpdate({id_dio: req.params.id_dio}, req.body, {new: true}, function onUpdate(err, dio) {
					if (err) {
						res.status(500).send(err);
					} else if (!dio) {
						res.sendStatus(404);
					} else {
						res.send(dio);
					}
				});	
			}			
		})

		.delete(function (req, res) {
			Dio.findOneAndRemove({id_dio: req.params.id_dio}, function onRemove(err, dio) {
				if (err) {
					res.status(500).send(err);
				} else if (!dio) {
					res.sendStatus(404);
				} else {
					res.sendStatus(204);
				}
			});
		});


	app.route('/dio/:id_dio([0-9]{1,2})/:status(on|off)')

		.get(function (req, res) {
			process.add(req.params.id_dio,req.params.status === 'on'); 
			res.end();
		});

}