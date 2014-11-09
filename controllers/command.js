 var Command = require('./../models/commands');

exports.init = function(app){
	app.route('/command')

		.get(function(req,res){
			Command.find(function(err, bears) {
				if (err){
					res.send(err).end();
				}else{
					res.json(bears);
				}

			});
		})

		.post(function(req,res){
			var command = new Command(); 

			if(req.body.command === undefined && req.body.url === undefined){
				res.json({response: 'Error' })
				
			}else{
				command.command = req.body.command;
				command.url = req.body.url;

				command.save(function(err) {
					if (err){
						res.send(err).end();
					}else{
						res.json({response: 'Command created' });
					}

				});			
			}	
		});

	app.route('/command/:id_command')

		.get(function(req,res){
			Command.findById(req.params.id_command, function(err, command) {
				if (err){
					res.send(err).end();
				}else{
					res.json(command);
				}

			});
		})

		.put(function(req,res){
			Command.findById(req.params.id_command, function(err, command) {
				if (err){
					res.send(err).end();
				}else{		

					command.command = (req.body.command === undefined) ? command.command : req.body.command;

					command.save(function(err) {
						if (err){
							res.send(err).end();
						}else{
							res.json({response: 'Command updated' });
						}

					});
				}

			});
		})

		.delete(function(req, res){
			Command.remove({_id: req.params.id_command}, function(err, command) {
				if (err){
					res.send(err).end();
				}else{
					res.json({response: 'Successfully deleted' });
				}

			});
		});
}