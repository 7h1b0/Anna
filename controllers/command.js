exports.init = function(app,connection){
	app.route('/command')

		.get(function(req,res){
			connection.query('SELECT * FROM command', function(err, results) {
				if (err){
					res.status(500).send(err).end();
				}else{
					res.json(results);
				}
			});
		})

		.post(function(req,res){
		
			if(req.body.title === undefined || req.body.url === undefined){
				res.status(400).json({response: 'Error' })
				
			}else{
				connection.query('INSERT INTO command(id,title,url) VALUES (NULL, ?,?)', [req.body.title,req.body.url], function(err,results){
					if (err){
						res.status(500).send(err).end();
					}else{
						res.status(204).end();
					}
				});		
			}	
		});

	app.route('/command/:id_command')

		.get(function(req,res){
			connection.query('SELECT * FROM command WHERE id = ?', [req.params.id_command], function(err, results) {
				if (err){
					res.status(500).send(err).end();
				}else{
					res.json(results);
				}
			});
		})

		.put(function(req,res){
			if(req.body.title === undefined || req.body.url === undefined){
				res.status(400).json({response: 'Error' })

			}else{
				connection.query('UPDATE command SET title = ?,url = ? WHERE id = ?', [req.body.title,req.body.url,req.params.id_command], function(err, results) {
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