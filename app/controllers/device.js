exports.init = function(app,db){

	var deviceManager 	= require('./../managers/deviceManager');
	var processManager 	= require('./../managers/processManager');
	var manager 		= new deviceManager(db);
	var process 		= new processManager();

	app.route('/device')

		.get(function(req,res){
			manager.getAll(function(rows){
				res.send(rows);
			}, function(err){
				res.status(500).send(err);
			});
		})

		.post(function(req,res){
			if(req.body.title === undefined || req.body.id === undefined || req.body.isGroup === undefined){
				res.sendStatus(400);	
			}else{
				manager.add(req.body, function(){
					res.sendStatus(201);
				}, function(err){
					res.status(409).send(err);
				});
			}
		});

	app.route('/device/:id_device([0-9]{1,2})')

		.get(function(req,res){
			manager.get(req.params.id_device, function(row){
				res.send(row);
			},function(err){
				res.status(500).send(err);
			});
		})

		.put(function(req,res){
			if(req.body.title === undefined){
				res.sendStatus(400);
			}else{
				manager.update(req.body, function(){
					res.sendStatus(204);
				}, function(err){
					res.status(500).send(err);
				});		
			}			
		})

		.delete(function(req, res){
			manager.delete(req.params.id_device, function(){
				res.sendStatus(204);
			}, function(err){
				res.status(500).send(err);
			});
		});


	app.route('/device/:status(on|off)/:id_device([0-9]{1,2})')

		.get(function(req,res){
			manager.getDevices(req.params.id_device, function(rows){
				if(rows === undefined || rows.length == 0){
					process.add(req.params.id_device,req.params.status === 'on');
				}else{
					process.addArray(rows, req.params.status === 'on');
				}
				res.sendStatus(204);
			}, function(err){
				res.status(500).send(err);
			});	 
		});

}