var process = require('./../managers/processManager'),
	deviceManager = require('./../managers/deviceManager');

exports.init = function(app,db){
	var deviceManager = new deviceManager(db);

	app.route('/device')

		.get(function(req,res){
			deviceManager.getAll(function(rows){
					res.send(rows);
				}, function(err){
					res.status(404).send(err);
			});
		})

		.post(function(req,res){
			if(req.body.title === undefined || req.body.id === undefined || req.body.isGroup === undefined){
				res.status(400).json({response: 'Error' });		
			}else{
				deviceManager.add(req.body, function(){
						res.status(201).end();
					}, function(err){
						res.status(409).send(err);
				});
			}
		});

	app.route('/device/:id_device([0-9]{1,2})')

		.get(function(req,res){
			deviceManager.get(req.params.id_device, function(row){
					res.send(row);
				},function(err){
					res.status(404).send(err);
			});
		})

		.put(function(req,res){
			if(req.body.title === undefined){
				res.status(400).json({response: 'Error' })
			}else{
				deviceManager.update(req.body, function(){
						res.status(204).end();
					}, function(err){
						res.status(404).send(err);
				});		
			}			
		})

		.delete(function(req, res){
			deviceManager.delete(req.params.id_device, function(){
					res.status(204).end();
				}, function(err){
					res.status(404).send(err);
			});
		});


	app.route('/device/:status(on|off)/:id_device([0-9]{1,2})')

		.get(function(req,res){
			deviceManager.getDevices(req.params.id_device, function(rows){
				if(rows === undefined || rows.length == 0){
					process.exec(req.params.id_device, req.params.status === 'on', function(err){
						if(err){
							res.status(404).send(err).end();
						} else{
							res.status(204).end();
						}
					});
				}else{
					for(var i=0, length = rows.length; i< length; i++){
						(function(i){
						   	setTimeout(function() {
								process.exec(rows[i], req.params.status === 'on', function(err){});
							}, 500*i);
						})(i);
						res.status(204).end();
					}
				}
			});	 
		});

}