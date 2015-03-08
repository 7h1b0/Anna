var process = require('./../services/processHandler');

exports.init = function(app,connection){
	app.route('/command')

		.get(function(req,res){
			connection.query('SELECT id,title FROM command', function(err, results) {
				if (err){
					res.status(500).send(err).end();
				}else{
					res.send(results);
				}
			});
		})

		.post(function(req,res){
		
			if(req.body.title === undefined || req.body.params === undefined){
				res.status(400).json({response: 'Error' })			
			}else{
				connection.query('INSERT INTO command(id,title) VALUES (NULL, ?)', [req.body.title], function(err,results){
					if (err){
						res.status(500).send(err).end();
					}else{

						req.body.params.forEach(function(item, index) {
							setTimeout(function(id,device, status) {	
								connection.query('INSERT INTO params(id,device,status) VALUES (?,?,?)', [id,device,status], function(err,results){
									if (err) res.status(500).send(err).end();
								});		 
							}, 1000,results.insertId,item.device,item.status);
						});

						res.status(204).end();
					}
				});		
			}	
		});

	app.route('/command/:id_command')

		.get(function(req,res){
			connection.query('SELECT device,status FROM params WHERE id = ?', [req.params.id_command], function(err, results) {
				if (err){
					res.status(500).send(err).end();
				}else{
					var prefix = "./radioEmission";

					results.forEach(function(item, index) {
						setTimeout(function(script) {	
							console.log(script);
							process.exec(script);			 
						}, 1000, prefix + " " + item.device + " " + item.status);
					});

					res.status(204).end();
				}
			});
		})

		.put(function(req,res){
			if(req.body.title === undefined){
				res.status(400).json({response: 'Error' })
			}else{
				connection.query('UPDATE command SET title = ? WHERE id = ?', [req.body.title,req.params.id_command], function(err, results) {
					if (err){
						res.status(500).send(err).end();
					}else{
						res.status(204).end();
					}
				});
			}			
		})

		.delete(function(req, res){
			connection.query('DELETE FROM command WHERE id = ?', [req.params.id_command], function(err, results) {
				if (err){
					res.status(500).send(err).end();
				}else{
					res.status(204).end();
				}
			});
		});
}