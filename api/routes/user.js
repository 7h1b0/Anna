module.exports = function (router) {

	const User 						= require('./../models/user');
	const cryptoHelper 		= require('./../helpers/cryptoHelper');

	router.post('/user', function (req, res) {
		const badRequest = req.body.username === undefined || req.body.password === undefined;
		
		if (badRequest) {
			res.sendStatus(400);	
		} else {
			const newUser = User({
				username: req.body.username,
				password: cryptoHelper.hash(req.body.password),
				token: cryptoHelper.random()
			});

			newUser.save(function onSave(err, user) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.send(user);
				}
			});
		}
	});

	router.post('/authentification', function (req, res) {
		const badRequest = req.body.username === undefined || req.body.password === undefined;
		
		if (badRequest) {
			res.sendStatus(400);	
		} else {
			User.findOne({username : req.params.username}, function onFind(err, user) {
				if (err) {
					res.status(500).send(err);
				} else if (!username) {
					res.sendStatus(404);
				} else {
					if (cryptoHelper.verify(req.body.password, user.password)){
						return user;
					} else {
						res.sendStatus(403);
					}
				}
			});
		}
	});

	router.get('/api/user', function (req, res) {
		User.find({}).select('username').then(function (users){
			res.send(users);
		}, function (err) {
			res.status(500).send(err);
		})
	})

	router.route('/api/user/:id_user([0-9a-z]{24})')
		.put(function (req, res) {
			const badRequest = req.body.password === undefined;
			
			if (badRequest) {
				res.sendStatus(400);	
			} else {
				User.findByIdAndUpdate(req.params.id_user, req.body.password, {new: true}, function onUpdate(err, user) {
					if (err) {
						res.status(500).send(err);
					} else if (!user) {
						res.sendStatus(404);
					} else {
						res.sendStatus(204);
					}
				});
			}
		})

		.delete(function (req, res) {
			User.findByIdAndRemove(req.params.id_user, function onRemove(err, user) {
				if (err) {
					res.status(500).send(err);
				} else if (!user) {
					res.sendStatus(404);
				} else {
					res.sendStatus(204);
				}
			});
		});
}