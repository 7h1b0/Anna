var Command = require('./../models/commands');

exports.init = function(app){
	app.route('/command')

		.get(function(req,res){
			Command.find(function(err, bears) {
				if (err)
					res.send(err);

				res.json(bears);
			});
		})

		.post(function(req,res){
			var command = new Command(); 		
				command.command = req.body.command;
				command.url = req.body.url;

			command.save(function(err) {
				if (err)
					res.send(err);

				res.json({response: 'Command created!' });
			});
		});

	app.route('/command/:id_command')

		.get(function(req,res){
			Command.findById(req.params.id_command, function(err, commands) {
				if (err)
					res.send(err);

				res.json(commands);
			});
		})

		.delete(function(req, res){
			Command.remove({_id: req.params.id_command}, function(err, commands) {
				if (err)
					res.send(err);

				res.json({response: 'Successfully deleted' });
			});
		});
}