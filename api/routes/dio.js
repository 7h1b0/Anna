module.exports = function (router) {

	const processService 	= require('./../services/processService');
	const Dio 						= require('./../models/dio.js');
	const process 				= new processService();

	router.route('/api/dios')
		.get((req,res) => {
			Dio.find({})
				.then(dios => res.send(dios))
				.catch(err => res.status(500).send(err));
		})

		.post((req,res) => {
			const badRequest = req.body.id_dio === undefined || req.body.name === undefined;
			
			if (badRequest) {
				res.sendStatus(400);	
			} else {
				const newDio = Dio({
					id_dio: req.body.id_dio,
					name: req.body.name
				});

				newDio.save()
					.then(dio => res.status(201).send(dio))
					.catch(err => res.status(500).send(err));
			}
		});

	router.route('/api/dios/:id_dio([0-9]{1,2})')
		.get((req,res) => {
			Dio.findOne({id_dio: req.params.id_dio})
				.then(dio => {
					if (!dio) {
						res.sendStatus(404);
					} else {
						res.send(dio);
					}
				}).catch(err => res.status(500).send(err));
		})

		.put((req,res) => {
			if (req.body.name === undefined) {
				res.sendStatus(400);
			} else {
				Dio.findOneAndUpdate({id_dio: req.params.id_dio}, req.body, {new: true})
					.then(dio => {
						if (!dio) {
							res.sendStatus(404);
						} else {
							res.send(dio);
						}
					}).catch(err => res.status(500).send(err));
			}			
		})

		.delete((req, res) => {
			Dio.findOneAndRemove({id_dio: req.params.id_dio})
				.then(dio => {
					if (!dio) {
						res.sendStatus(404);
					} else {
						res.sendStatus(204);
					}
				}).catch(err => res.status(500).send(err));
		});


	router.get('/api/dios/:id_dio([0-9]{1,2})/:status(on|off)', (req, res) => {
		process.add(req.params.id_dio,req.params.status === 'on'); 
		res.end();
	});

}