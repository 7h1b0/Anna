exports.init = function(app,db){

	var supplyManager 		= require('./../manager/supplyManager');
	var processManager 		= require('./../manager/processManager');
	var manager 			= new supplyManager(db);
	var process 			= new processManager();

	app.route('/dio/supply')

		.get(function (req,res){
			manager.getAll(function(rows){
				res.send(rows);
			}, function (err){
				res.status(500).send(err);
			});
		})

		.post(function (req,res){
			if (req.body.name === undefined || req.body.id === undefined) {
				res.sendStatus(400);	
			} else {
				manager.add(req.body, function (){
					res.sendStatus(201);
				}, function (err){
					res.status(409).send(err);
				});
			}
		});

	app.route('/dio/supply/:id_supply([0-9]{1,2})')

		.get(function (req,res){
			manager.get(req.params.id_supply, function (row){
				res.send(row);
			},function (err){
				res.status(500).send(err);
			});
		})

		.put(function (req,res){
			if (req.body.name === undefined) {
				res.sendStatus(400);
			} else {
				req.body.id = req.params.id_supply;
				manager.update(req.body, function (){
					res.sendStatus(204);
				}, function (err){
					res.status(500).send(err);
				});		
			}			
		})

		.delete(function (req, res){
			manager.delete(req.params.id_supply, function (){
				res.sendStatus(204);
			}, function (err){
				res.status(500).send(err);
			});
		});


	app.route('/dio/supply/:id_supply([0-9]{1,2})/:status(on|off)')

		.get(function (req,res){
			process.add(req.params.id_supply,req.params.status === 'on'); 
			res.end();
		});

}