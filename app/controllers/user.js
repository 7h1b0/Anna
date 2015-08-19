exports.init = function(app,db){

	var jwt 			= require('jsonwebtoken');
	var userManager 	= require('./../managers/userManager');
	var password		= require('./password');
	var manager 		= new userManager(db);

	app.route('/authenticate')

		.post(function(req,res){
			manager.find(req.body.name, function(user){
				if(password.compare(req.body.password,user.password)){
					var token = jwt.sign(user, app.get('config').secret, {
						expiresInMinutes: 1440
			        });

			        res.json({
			          token: token
			        });
				}else{
					res.sendStatus(403);
				}

			}, function(err){
				res.sendStatus(403);
			});
		});

	app.use(function(req,res,next){
		
		var token = req.headers['x-access-token'];
		if(token){
			jwt.verify(token, app.get('config').secret, function(err, decoded) {      
				if(err) {
					res.sendStatus(403);    
				}else {
					next();
				}
			});
		}else{
			res.sendStatus(403);
		}
	});

	app.route('/user')

		.get(function(req,res){
			manager.getAll(function(rows){
				res.send(rows);
			}, function(err){
				res.status(500).send(err);
			});
		})

		.post(function(req, res){
			if(!app.get('config').add_user){
				res.sendStatus(404);
			}else if(req.body.name === undefined || req.body.password === undefined){
				res.sendStatus(400);	
			}else{
				req.body.password = password.crypt(req.body.password);
				manager.add(req.body, function(){
					res.sendStatus(201);
				}, function(err){
					res.status(409).send(err);
				});
			}
		});

	app.route('/user/:id_user([0-9]{1,2})')

		.put(function(req,res){
			if(req.body.password === undefined){
				res.sendStatus(400);
			}else{
				req.body.id = req.params.id_user;
				req.body.password = password.crypt(req.body.password);

				manager.update(req.body, function(){
					res.sendStatus(204);
				}, function(err){
					res.status(500).send(err);
				});		
			}
		})

		.delete(function(req,res){
			if(app.get('config').delete_user){
				manager.delete(req.params.id_user, function(){
					res.sendStatus(204);
				}, function(err){
					res.status(500).send(err);
				});
			}else{
				res.sendStatus(404);
			}
			
		})

}