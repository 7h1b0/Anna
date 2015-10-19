exports.init = function(app){

	var processController 	= require('./process');
	var Dio 				= require('./../models/dio.js');
	var process 			= new processController();

	// TODO - Remove /supply
	app.route('/dio/supply')

		.get(function (req,res){
			Dio.find({}, function (err, dios){
				if (err) {
					res.status(500).send(err);
				} else {
					res.send(dios);
				}
			});
		})

		.post(function (req,res){
			if (req.body.id_dio === undefined || req.body.name === undefined) {
				res.sendStatus(400);	
			} else {
				var newDio = Dio({
					id_dio: req.body.id_dio,
					name: req.body.name
				});

				newDio.save(function (err, supply){
					if (err) {
						res.status(500).send(err);
					} else {
						res.send(supply);
					}
				});
			}
		});

	app.route('/dio/supply/:id_dio')

		.get(function (req,res){
			Dio.find({id_dio: req.params.id_dio}, function (err, dios){
				if (err) {
					res.status(500).send(err);
				} else if (dios.length == 0) {
					res.sendStatus(404);
				} else {
					res.send(dios[0]);
				}
			});
		})

		.put(function (req,res){
			if (req.body.name === undefined) {
				res.sendStatus(400);
			} else {
				Dio.find({id_dio: req.params.id_dio}, function (err, dios){
					if (err) {
						res.status(500).send(err);
					} else if (dios.length == 0) {
						res.sendStatus(404);
					} else {
						var Dio = dios[0];
						Dio.name = req.body.name;
						Dio.save(function (err, Dio){
							if (err) {
								res.status(500).send(err);
							} else {
								res.send(Dio);
							}
						});
					}
				});	
			}			
		})

		.delete(function (req, res){
			Dio.find({id_dio: req.params.id_dio}, function (err, dios){
				if (err) {
					res.status(500).send(err);
				} else if (dios.length == 0) {
					res.sendStatus(404);
				} else {
					dios[0].remove(function (err){
						if (err) {
							res.status(500).send(err);
						} else {
							res.sendStatus(204);
						}
					});
				}
			});
		});


	app.route('/dio/supply/:id_dio/:status(on|off)')

		.get(function (req,res){
			process.add(req.params.id_dio,req.params.status === 'on'); 
			res.end();
		});

}