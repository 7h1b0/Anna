var process = require('./../services/processHandler');

exports.init = function(app,db){
	app.route('/command')

		.get(function(req,res){
			db.all('SELECT id,title FROM command', function(err, rows) {
				if(err){
					res.status(500).send(err).end();
				} else {
					res.send(rows);
				}
			});
		})

		.post(function(req,res){
		
			if(req.body.title === undefined || req.body.params === undefined){
				res.status(400).json({response: 'Error' });		
			}else{
				db.run("BEGIN");
				db.run('INSERT INTO command(id,title) VALUES (NULL, ?)', [req.body.title], function(err){
					var id = this.lastID;
					req.body.params.forEach(function(item) {
						db.run('INSERT INTO params(id,device,status) VALUES (?,?,?)', [id,item.device,item.status], function(err){} );		 
					});
					db.run("COMMIT", function(err){
						res.status(204).end();
					});
				});		
			}	
		});

	app.route('/command/:id_command([0-9]{1,3})')

		.get(function(req,res){
			var index = 0;
			db.each('SELECT device,status FROM params WHERE id = ?', [req.params.id_command], function(err, row) {
				if (err){
					res.status(500).send(err).end();
				} else {
					var prefix = "./radioEmission";
					index++;

					setTimeout(function(script) {	
						process.exec(script);			 
					}, 500*index, prefix + " " + row.device + " " + row.status);

					
				}
			}, function(err, row){
				if(err){
					res.status(500).send(err).end();
				} else {
					res.status(204).end();
				}
			});
			
		})

		.put(function(req,res){
			if(req.body.title === undefined){
				res.status(400).json({response: 'Error' })
			}else{
				db.run('UPDATE command SET title = ? WHERE id = ?', [req.body.title,req.params.id_command], function(err){
					if(err){
						res.status(500).send(err).end();
					} else {
						res.status(204).end();
					}
				});
				
			}			
		})

		.delete(function(req, res){
			db.run("BEGIN")
				.run('DELETE FROM command WHERE id = ?', [req.params.id_command], function(err){})
				.run('DELETE FROM params WHERE id = ?', [req.params.id_command], function(err){})
				.run("COMMIT", function(err){
					res.status(204).end();
				});
		});
}