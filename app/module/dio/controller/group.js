exports.init = function (app,db){

	var groupManager 		= require('./../manager/groupManager');
	var processManager 		= require('./../manager/processManager');
	var manager 			= new groupManager(db);
	var process 			= new processManager();

	app.route('/dio/group')

		.get(function (req,res){
			manager.getAll(function (rows){
				res.send(rows);
			}, function (err){
				res.status(500).send(err);
			});
		})

		.post(function (req,res){
			if (req.body.name === undefined || req.body.supplies === undefined) {
				res.sendStatus(400);	
			} else {
				manager.add(req.body, function (result){
					res.send(result);
				}, function (err){
					res.status(409).send(err);
				});
			}
		});

	app.route('/dio/group/:id_group([0-9]{1,2})')

		.get(function (req,res){
			manager.getSupplies(req.params.id_group, function (rows){
				var group = {};
				group.supplies = rows;
				res.send(group);
			},function (err){
				res.status(500).send(err);
			});
		})

		.put(function(req,res){
			if (req.body.name === undefined) {
				res.sendStatus(400);
			} else {
				req.body.id = req.params.id_group;
				manager.update(req.body, function (){
					res.sendStatus(204);
				}, function (err){
					res.status(500).send(err);
				});		
			}			
		})

		.delete(function (req, res){
			manager.delete(req.params.id_group, function (){
				res.sendStatus(204);
			}, function (err){
				res.status(500).send(err);
			});
		});


	app.route('/dio/group/:id_group([0-9]{1,2})/:status(on|off)')

		.get(function (req,res){
			manager.getSupplies(req.params.id_group, function (row){
				process.addArray(row, req.params.status === 'on');
				res.end();
			},function (err){
				res.status(500).send(err);
			});
		});

}