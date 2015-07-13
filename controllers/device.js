var process = require('./../managers/processManager');

exports.init = function(app,db){
	app.route('/device')

		.get(function(req,res){
			db.all('SELECT id,title FROM device', function(err, rows) {
				if(err){
					res.status(404).send(err).end();
				} else {
					res.send(rows);
				}
			});
		})

		.post(function(req,res){
		
			if(req.body.title === undefined || req.body.id === undefined){
				res.status(400).json({response: 'Error' });		
			}else{
				db.run('INSERT INTO device(id,title) VALUES (?,?)', [req.body.id,req.body.title], function(err){
					if(err){
						console.log(err);
						res.status(409).send(err).end();
					} else{
						res.status(201).end();
					}
				});		
			}	
		});

	app.route('/device/:id_device([0-9]{1,2})')

		.put(function(req,res){
			if(req.body.title === undefined){
				res.status(400).json({response: 'Error' })
			}else{
				db.run('UPDATE device SET title = ? WHERE id = ?', [req.body.title,req.params.id_device], function(err){
					if(err){
						res.status(404).send(err).end();
					} else {
						res.status(204).end();
					}
				});
				
			}			
		})

		.delete(function(req, res){
			db.run('DELETE FROM device WHERE id = ?', [req.params.id_device],function(err){
				if(err){
					res.status(404).send(err).end();
				} else{
					res.status(204).end();
				}
			});	
		});


	app.route('/device/:id_device([0-9]{1,2})/:status(0|1)')

		.get(function(req,res){
			process.exec(req.params.id_device, req.params.status, function(err){
				if(err){
					res.status(404).send(err).end();
				} else{
					res.status(204).end();
				}
			});		 
		});

}