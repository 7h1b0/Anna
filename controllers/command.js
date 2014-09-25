
exports.init = function(app){
	app.route('/command')

		.get(function(req,res){
			res.json({
				commands:[
					{
						command:"Anna, lumière",
						url:"http://domo:666/action?launch=transmit&id=2&status=on",
						confidence:"0.9"
					},
					{
						command:"Au revoir Anna",
						url:"http://domo:666/action?launch=out",
						confidence:"0.9"
					},
					{
						command:"Anna, télévision",
						url:"http://domo:666/action?launch=tv",
						confidence:"0.9"
					},
					{
						command:"Bonne nuit Anna",
						url:"http://domo:666/action?launch=sleep",
						confidence:"0.9"
					}
				]
			});
		})

		.post(function(req,res){
			// TO DO ...
		});

	app.route('/command/:id_command')

		.get(function(req,res){
			// TO DO ...
		})

		.delete(function(req, res){
			// TO DO ...
		});
}