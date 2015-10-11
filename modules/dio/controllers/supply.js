exports.init = function(app){

	var processManager 		= require('./../managers/processManager');
	var DioSupply 			= require('./../models/dioSupply.js');
	var process 			= new processManager();

	app.route('/dio/supply')

		.get(function (req,res){
			DioSupply.find({}, function (err, supplies){
				if (err) {
					res.status(500).send(err);
				} else {
					res.send(supplies);
				}
			});
		})

		.post(function (req,res){
			if (req.body.id_supply === undefined || req.body.name === undefined) {
				res.sendStatus(400);	
			} else {
				var newDioSupply = DioSupply({
					id_supply: req.body.id_supply,
					name: req.body.name
				});

				newDioSupply.save(function (err, supply){
					if (err) {
						res.status(500).send(err);
					} else {
						res.send(supply);
					}
				});
			}
		});

	app.route('/dio/supply/:id_supply')

		.get(function (req,res){
			DioSupply.find({id_supply: req.params.id_supply}, function (err, dioSupplies){
				if (err) {
					res.status(500).send(err);
				} else if (dioSupplies.length == 0) {
					res.sendStatus(404);
				} else {
					res.send(dioSupplies[0]);
				}
			});
		})

		.put(function (req,res){
			if (req.body.name === undefined) {
				res.sendStatus(400);
			} else {
				DioSupply.find({id_supply: req.params.id_supply}, function (err, dioSupplies){
					if (err) {
						res.status(500).send(err);
					} else if (dioSupplies.length == 0) {
						res.sendStatus(404);
					} else {
						var dioSupply = dioSupplies[0];
						dioSupply.name = req.body.name;
						dioSupply.save(function (err, dioSupply){
							if (err) {
								res.status(500).send(err);
							} else {
								res.send(dioSupply);
							}
						});
					}
				});	
			}			
		})

		.delete(function (req, res){
			DioSupply.find({id_supply: req.params.id_supply}, function (err, dioSupplies){
				if (err) {
					res.status(500).send(err);
				} else if (dioSupplies.length == 0) {
					res.sendStatus(404);
				} else {
					dioSupplies[0].remove(function (err){
						if (err) {
							res.status(500).send(err);
						} else {
							res.sendStatus(204);
						}
					});
				}
			});
		});


	app.route('/dio/supply/:id_supply/:status(on|off)')

		.get(function (req,res){
			process.add(req.params.id_supply,req.params.status === 'on'); 
			res.end();
		});

}